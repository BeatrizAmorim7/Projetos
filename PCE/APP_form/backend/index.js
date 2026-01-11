const express = require("express");
const cors = require("cors");
const webPush = require('web-push');
const schedule = require('node-schedule');
const { Pool } = require("pg");
const axios = require('axios');
const { v4: uuidv4 } = require("uuid");
const { extractPatientData } = require("./extract_person");
const { extractMedicationData } = require("./extract_medication"); 

const {
  extractPainData,
  extractBodySites,
  extractPrecipitatingFactors,
  extractResolvingFactors,
  extractAssociatedSymptoms,
  extractExaminationFindings,
  extractMediaFiles,
  extractPainAssessment,
  extractPhq9Assessment,
} = require("./extract_pain");

const e = require("express");

const {
  createPersonalInfoBundle,
  createPainBundle,
  createMedicationBundle,
} = require('./fhir_mapper');

const app = express();
const port = 5001;

app.use(
  cors({
    origin: "http://localhost:3000", // Ajuste conforme necessário
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// Conexão à base de dados
const pool = new Pool({
  user: "nextgen_user",
  host: "localhost",
  database: "pce_forms",
  password: "nextgen_password",
  port: 5432,
});

// Mirth Connect configuration
const mirthConfig = {
  url: 'http://localhost:8081/fhir/', // Updated to match admin HTTPS port
  headers: {
    'Content-Type': 'application/json',
    // Add authentication if required, e.g., 'Authorization': 'Bearer <token>'
    // 'X-API-Key': 'your-api-key'
  },
};

// VAPID keys
const vapidKeys = {
  publicKey: 'BBVGZH7ko7dK1cU9q131CRHE8QWLAbMdbB0elFAoUyZ2tKrotDkBNiAXK9itN5rBEGwwuBWuldakroDGhl8swLE',
  privateKey: 'QfV52OcDx-wcjuN_z4SP3VLAomvF2wMMCphz-yY5R-0',
};
webPush.setVapidDetails(
  'mailto:your-email@example.com', 
  vapidKeys.publicKey,
  vapidKeys.privateKey
);


const checkIncompleteForms = async (n_utente) => {
  try {
    // Query database for "dor" form submissions
    const response = await pool.query(
      "SELECT * FROM composition WHERE n_utente = $1 AND composition_type = 'dor'",
      [n_utente]
    );
    const submissions = response.rows; 
    // Check if any "dor" submission is from the last 7 days
    const hasDorSubmission = submissions.some(
      (sub) =>
        new Date(sub.created_at) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    return !hasDorSubmission; // True if no recent submissions
  } catch (err) {
    console.error(`Erro ao verificar os forms do utente ${n_utente}:`, err);
    return false; 
  }
};

const sendReminder = async (n_utente, subscription) => {
  // Obter o nome do utente da base de dados para a notificação ser mais personalizada
  let nomeUtente = n_utente;
  try {
    const result = await pool.query(
      "SELECT name FROM personal_info WHERE n_utente = $1",
      [n_utente]
    );
    if (result.rows.length > 0 && result.rows[0].name) {
      nomeUtente = result.rows[0].name;
    }
  } catch (err) {
    console.error(`Erro ao obter o nome do utente ${n_utente}:`, err);
  }
  const payload = JSON.stringify({
    title: `Olá, ${nomeUtente}!`,
    body: 'Por favor complete o formulário da dor!',
    url: '/dashboard',
  });
  try {
    await webPush.sendNotification(subscription, payload);
    console.log(`Notificação enviada ao utente ${n_utente}`);
  } catch (err) {
    console.error(`Erro ao enviar notificação para o utente ${n_utente}:`, err);
  }
};

const scheduledJobs = {}; // Guarda jobs por n_utente

// Schedule reminders for all users - com preferências
const scheduleReminders = async () => {
  try {
    const result = await pool.query('SELECT n_utente, notification_hour, subscription FROM push_preferences');
    for (const { n_utente, notification_hour, subscription } of result.rows) {
      // Cancela job antigo se existir
      if (scheduledJobs[n_utente]) {
        scheduledJobs[n_utente].cancel();
      }
      // Agenda novo job
      const job = schedule.scheduleJob(`0 ${notification_hour} * * *`, async () => {
        console.log(`Verificar forms para o utente ${n_utente} às ${notification_hour}:00`);
        if (await checkIncompleteForms(n_utente)) {
          await sendReminder(n_utente, subscription);
        }
      });
      scheduledJobs[n_utente] = job; // Guarda o job
      console.log(`Notificação agendada para o utente ${n_utente} às ${notification_hour}:00`);
    }
  } catch (err) {
    console.error('Erro ao agendar notificação:', err);
  }
};

// Run initial scheduling and re-schedule on subscription changes
scheduleReminders();

// Função auxiliar para extrair n_utente do campo identifier
function extractNUtente(composition) {
  try {
    const identifierField = composition["items.0.0.items.1.value"];
    if (Array.isArray(identifierField) && identifierField.length > 0) {
      const value = identifierField[0].value;
      const parsed = JSON.parse(value);
      return parsed.blocks[0]?.text || null;
    }
    return null;
  } catch (err) {
    console.error("Erro ao extrair n_utente:", err);
    return null;
  }
}


app.post("/api/composition_med", async (req, res) => {
  let { composition, n_utente } = req.body;

  // Log para depurar o valor recebido
  console.log("Requisição recebida (medicação):", { composition, n_utente });

  if (!composition || !n_utente) {
    return res.status(400).json({ error: "É necessário 'composition' e 'n_utente'" });
  }

  if (typeof composition === "string") {
    try {
      composition = JSON.parse(composition);
    } catch (err) {
      return res.status(400).json({ error: "JSON inválido em 'composition'" });
    }
  }

  const id = uuidv4();
  const composition_type = "med"; // <- define o tipo aqui

  const { name, dose, duration } = extractMedicationData(composition);

  if (!name) {
    console.error("Nome da medicação em falta. Inserção cancelada.");
    return res.status(400).json({ error: "Nome da medicação em falta." });
  }

  try {
    // Iniciar transação
    await pool.query("BEGIN");

    await pool.query(
      "INSERT INTO composition (id, n_utente, composition, composition_type) VALUES ($1, $2, $3, $4)",
      [id, n_utente, composition, composition_type]
    );

    await pool.query(
      "INSERT INTO patient_medication (id, n_utente, nome_medicamento, dose, duracao_administracao, created_at) VALUES ($1, $2, $3, $4, $5, DEFAULT)",
      [uuidv4(), n_utente, name, dose, duration]
    );

    // Confirmar transação
    await pool.query("COMMIT");

    res.status(201).json({ message: "Dados da medicação guardados com sucesso!", id });
  } catch (err) {
    // Reverter transação em caso de erro
    await pool.query("ROLLBACK");
    console.error("Erro ao guardar os dados da medicação:", err);
    res.status(500).json({ error: "Erro ao guardar os dados da medicação" + err.message });
  }
});

app.post("/api/composition_dor", async (req, res) => {
  let { composition, n_utente } = req.body;

  // Log para depurar o valor recebido
  console.log("Requisição recebida (dor):", { composition, n_utente });


  if (!composition || !n_utente) {
    return res.status(400).json({ error: "É necessário 'composition' e 'n_utente'" });
  }

  if (typeof composition === "string") {
    try {
      composition = JSON.parse(composition);
    } catch (err) {
      return res.status(400).json({ error: "JSON inválido em 'composition'" });
    }
  }

  const id = uuidv4();
  const composition_type = "dor"; // <- define o tipo aqui


  try {
    // Iniciar transação
    await pool.query("BEGIN");

    await pool.query(
      "INSERT INTO composition (id, n_utente, composition, composition_type) VALUES ($1, $2, $3, $4)",
      [id, n_utente, composition, composition_type]
    );

    // 1. pain_symptoms
    const painData = extractPainData(composition, n_utente);

    const painQuery = `
      INSERT INTO pain_symptom (id, n_utente, name, occurrence, progression, description, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, DEFAULT)
      RETURNING id
    `;
    const painValues = [
      painData.id,
      painData.n_utente,
      painData.name,
      painData.occurrence,
      painData.progression,
      painData.description,
    ];
    const painResult = await pool.query(painQuery, painValues);
    const symptomId = painResult.rows[0].id;

    // 2. body_sites
    const bodySites = extractBodySites(composition, symptomId);
    for (const site of bodySites) {
      const siteQuery = `
        INSERT INTO body_sites (id, id_symptom, body_site, created_at)
        VALUES ($1, $2, $3, DEFAULT)
      `;
      await pool.query(siteQuery, [site.id, site.id_symptom, site.body_site]);
    }

    // 3. precipitating_factor
    const precipitatingFactors = extractPrecipitatingFactors(composition, symptomId);
    if (Array.isArray(precipitatingFactors)) {
      for (const factor of precipitatingFactors) {
        const factorQuery = `
          INSERT INTO precipitating_factor (id, id_symptom, factor, created_at)
          VALUES ($1, $2, $3, DEFAULT)
        `;
        await pool.query(factorQuery, [factor.id, factor.id_symptom, factor.factor]);
      }
    }
    
    // 4. resolving_factor
    const resolvingFactors = extractResolvingFactors(composition, symptomId);
    if (Array.isArray(resolvingFactors)) {
      for (const factor of resolvingFactors) {
        const factorQuery = `
          INSERT INTO resolving_factor (id, id_symptom, factor, created_at)
          VALUES ($1, $2, $3, DEFAULT)
        `;
        await pool.query(factorQuery, [factor.id, factor.id_symptom, factor.factor]);
      }
    }

    // 5. associated_symptom
    const associatedSymptoms = extractAssociatedSymptoms(composition, symptomId);
    for (const symptom of associatedSymptoms) {
      const symptomQuery = `
        INSERT INTO associated_symptom (id, id_symptom, name, description, occurrence, severity, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, DEFAULT)
      `;
      await pool.query(symptomQuery, [
        symptom.id,
        symptom.id_symptom,
        symptom.name,
        symptom.description,
        symptom.occurrence,
        symptom.severity,
      ]);
    }

    // 6. examination_findings
    const examData = extractExaminationFindings(composition, symptomId);
    let examId = null;
    if (examData.system_examined) {
      const examQuery = `
        INSERT INTO examination_findings (id, id_symptom, system_examined, created_at)
        VALUES ($1, $2, $3, DEFAULT)
        RETURNING id
      `;
      const examResult = await pool.query(examQuery, [
        examData.id,
        examData.id_symptom,
        examData.system_examined,
      ]);
      examId = examResult.rows[0].id;
    }

    // 7. media_files
    if (examId) {
      const mediaFiles = extractMediaFiles(composition, examId);
      for (const file of mediaFiles) {
        const fileQuery = `
          INSERT INTO media_files (id, id_exam_findings, file_dir, content_name, created_at)
          VALUES ($1, $2, $3, $4, DEFAULT)
        `;
        await pool.query(fileQuery, [
          file.id,
          file.id_exam_findings,
          file.file_dir,
          file.content_name,
        ]);
      }
    }

    // 8. abbey_pain_scale
    const painAssessment = extractPainAssessment(composition, symptomId);
    if (painAssessment.pain_score_category || painAssessment.pain_type) {
      const painAssessQuery = `
        INSERT INTO abbey_pain_scale (id, id_symptom, pain_score_category, pain_type, date, time, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, DEFAULT)
      `;
      await pool.query(painAssessQuery, [
        painAssessment.id,
        painAssessment.id_symptom,
        painAssessment.pain_score_category,
        painAssessment.pain_type,
        painAssessment.date,
        painAssessment.time,
      ]);
    }

    // 9. phq9
    const phq9Data = extractPhq9Assessment(composition, symptomId);
    if (
      phq9Data.sleep_issues ||
      phq9Data.tiredness ||
      phq9Data.appetite ||
      phq9Data.concentration ||
      phq9Data.self_harm_thoughts ||
      phq9Data.life_difficulty
    ) {
      const phq9Query = `
        INSERT INTO phq9 (id, id_symptom, sleep_issues, tiredness, appetite, concentration, self_harm_thoughts, life_difficulty, date, time, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, DEFAULT)
      `;
      await pool.query(phq9Query, [
        phq9Data.id,
        phq9Data.id_symptom,
        phq9Data.sleep_issues,
        phq9Data.tiredness,
        phq9Data.appetite,
        phq9Data.concentration,
        phq9Data.self_harm_thoughts,
        phq9Data.life_difficulty,
        phq9Data.date,
        phq9Data.time,
      ]);
    }


    // Confirmar transação
    await pool.query("COMMIT");

    res.status(201).json({ message: "Composição de dor guardada com sucesso!"});
  } catch (error) {
    // Reverter transação em caso de erro
    await pool.query("ROLLBACK");
    console.error("Erro ao guardar dados da dor:", error);
    res.status(500).json({ error: "Erro ao guardar dados da dor" });
  }
});


// Endpoint para guardar uma composição
app.post("/api/compositions", async (req, res) => {
  let { composition } = req.body;

  // Log para depurar o valor recebido
  console.log("Requisição recebida:", { composition });

  // Validar composition
  if (!composition) {
    return res.status(400).json({ error: "O campo 'composition' é obrigatório" });
  }

  if (typeof composition === "string") {
    try {
      composition = JSON.parse(composition);
    } catch (err) {
      return res.status(400).json({ error: "O campo 'composition' contém JSON inválido" });
    }
  }

  if (typeof composition !== "object") {
    return res.status(400).json({ error: "O campo 'composition' deve ser um objeto válido" });
  }

  // Extrair n_utente da composição
  const n_utente = extractNUtente(composition);
  if (!n_utente || typeof n_utente !== "string" || n_utente.trim() === "") {
    return res.status(400).json({ error: "O campo 'identifier' (n_utente) é obrigatório e deve ser uma string não vazia" });
  }

  const result = await pool.query(
    "SELECT n_utente, name FROM personal_info WHERE n_utente = $1",
    [n_utente]
  );

  if (result.rows.length > 0) { // não deixa adicionar se já existir um utente com esse n_utente
    console.log("Utente já existe:", result.rows[0]);
    return res.status(400).json({ error: "Utente já existe" });
  }
  
  const compositionId = uuidv4();
  const flat = extractPatientData(composition); // Extrai os dados "flattened"

  try {
    // Iniciar transação
    await pool.query("BEGIN");

    // Inserir informações pessoais (n_utente como chave primária)
    await pool.query(
      `INSERT INTO personal_info (n_utente, name, gender)
       VALUES ($1, $2, $3)
       ON CONFLICT (n_utente) DO NOTHING`,
      [n_utente, flat.personalInfo?.name || null, flat.personalInfo?.gender || null]
    );

    // Inserir endereço
    await pool.query(
      `INSERT INTO address (id, n_utente, address_line, city, district, postal_code, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        uuidv4(),
        n_utente,
        flat.address?.addressLine || null,
        flat.address?.city || null,
        flat.address?.district || null,
        flat.address?.postalCode || null,
        flat.address?.country || null,
      ]
    );

    // Inserir contato
    await pool.query(
      `INSERT INTO contact (id, n_utente, communication_type, communication_value)
       VALUES ($1, $2, $3, $4)`,
      [
        uuidv4(),
        n_utente,
        flat.contact?.communicationType || null,
        flat.contact?.communicationValue || null,
      ]
    );

    // Validar diagnóstico (name é obrigatório na tabela)
    if (!flat.diagnosis?.name) {
      throw new Error("O campo 'problem/diagnosis' é obrigatório!");
    }

    // Inserir diagnóstico
    await pool.query(
      `INSERT INTO diagnosis (
        id, n_utente, name, onset_date, onset_time, severity, 
        severity_description, severity_details, resolution_date, resolution_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        uuidv4(),
        n_utente,
        flat.diagnosis.name,
        flat.diagnosis?.onsetDate || null,
        flat.diagnosis?.onsetTime || null,
        flat.diagnosis?.severity || null,
        flat.diagnosis?.severityDescription || null,
        flat.diagnosis?.severityDetails || null,
        flat.diagnosis?.resolutionDate || null,
        flat.diagnosis?.resolutionTime || null,
      ]
    );

    // Inserir a composição original na tabela composition
    await pool.query(
      "INSERT INTO public.composition (id, n_utente, composition) VALUES ($1, $2, $3)",
      [compositionId, n_utente, composition]
    );

    // Confirmar transação
    await pool.query("COMMIT");

    res.status(201).json({ message: "Guardado com sucesso!", id: compositionId, n_utente: n_utente });
  } catch (err) {
    // Reverter transação em caso de erro
    await pool.query("ROLLBACK");
    console.error("Erro ao guardar:", err);
    res.status(500).json({ error: "Erro ao guardar a composição: " + err.message });
  }
});

// Endpoint para verificar utente
app.post("/api/patients/verify", async (req, res) => {
  const { identifier } = req.body;

  try {
    console.log("Verificando utente com identificador:", identifier);
    if (!identifier || typeof identifier !== "string" || identifier.trim() === "") {
      return res.status(400).json({ error: "O campo 'identifier' é obrigatório e deve ser uma string não vazia" });
    }

    const result = await pool.query(
      "SELECT n_utente FROM personal_info WHERE n_utente = $1",
      [identifier]
    );

    if (result.rows.length > 0) {
      console.log("Utente encontrado:", result.rows[0]);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error("Erro ao verificar o utente:", err);
    res.status(500).json({ error: "Erro ao verificar o utente: " + err.message });
  }
});

// Endpoint para retornar a composição “flattened”
app.get("/api/compositions/:id/flat", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT composition FROM public.composition WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Composição não encontrada" });
    }

    const composition = result.rows[0].composition;
    console.log("Composição recebida:", composition);
    const flat = extractPatientData(composition);
    console.log("Composição flatten:", flat);

    res.json({ id, flat });
  } catch (err) {
    console.error("Erro ao obter/flatten composition:", err);
    res.status(500).json({ error: "Erro no servidor: " + err.message });
  }
});


// Novo endpoint para obter dados do utente
app.get("/api/patients/:n_utente", async (req, res) => {
  const { n_utente } = req.params;

  try {
    const result = await pool.query(
      `SELECT p.n_utente, p.name, p.gender,
              a.address_line, a.city, a.district, a.postal_code, a.country,
              c.communication_type, c.communication_value,
              d.name as diagnosis_name, d.onset_date, d.onset_time, d.severity,
              d.severity_description, d.severity_details, d.resolution_date, d.resolution_time
       FROM personal_info p
       LEFT JOIN address a ON p.n_utente = a.n_utente
       LEFT JOIN contact c ON p.n_utente = c.n_utente
       LEFT JOIN diagnosis d ON p.n_utente = d.n_utente
       WHERE p.n_utente = $1`,
      [n_utente]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utente não encontrado" });
    }

    res.json(result.rows[0]); // Retorna o primeiro registro (único por n_utente)
  } catch (err) {
    console.error("Erro ao obter paciente:", err);
    res.status(500).json({ error: "Erro no servidor: " + err.message });
  }
});

// Endpoint para histórico de dor
app.get("/api/pain-history/:n_utente", async (req, res) => {
  const { n_utente } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        ps.id,
        ps.name,
        ps.occurrence,
        ps.progression,
        ps.description,
        ps.created_at,
        aps.pain_score_category,
        aps.pain_type,
        aps.date AS assessment_date,
        aps.time AS assessment_time
      FROM pain_symptom ps
      LEFT JOIN abbey_pain_scale aps ON ps.id = aps.id_symptom
      WHERE ps.n_utente = $1
      ORDER BY ps.created_at DESC
    `, [n_utente]);

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter histórico de dor:", err);
    res.status(500).json({ error: "Erro ao obter histórico de dor" + err.message});
  }
});



// Endpoint para locais de dor
app.get("/api/pain-body-sites/:n_utente", async (req, res) => {
  const { n_utente } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        bs.id,
        bs.id_symptom,
        bs.body_site,
        bs.created_at
      FROM body_sites bs
      JOIN pain_symptom ps ON bs.id_symptom = ps.id
      WHERE ps.n_utente = $1
      ORDER BY bs.created_at DESC
    `, [n_utente]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter locais de dor:", err);
    res.status(500).json({ error: "Erro ao obter locais de dor: " + err.message });
  }
});


// Só os body sites do último registo de dor
app.get("/api/pain-body-sites/:n_utente/last", async (req, res) => {
  const { n_utente } = req.params;
  try {
    const lastSymptomRes = await pool.query(
      `SELECT id FROM pain_symptom WHERE n_utente = $1 ORDER BY created_at DESC LIMIT 1`,
      [n_utente]
    );
    if (lastSymptomRes.rows.length === 0) return res.json([]);
    const lastSymptomId = lastSymptomRes.rows[0].id;
    const result = await pool.query(
      `SELECT id, id_symptom, body_site, created_at
       FROM body_sites
       WHERE id_symptom = $1
       ORDER BY created_at DESC`,
      [lastSymptomId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter locais de dor: " + err.message });
  }
});



// Endpoint para fatores precipitantes
app.get("/api/precipitating-factors/:n_utente", async (req, res) => {
  const { n_utente } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        pf.id,
        pf.id_symptom,
        pf.factor,
        pf.created_at
      FROM precipitating_factor pf
      JOIN pain_symptom ps ON pf.id_symptom = ps.id
      WHERE ps.n_utente = $1
      ORDER BY pf.created_at DESC
    `, [n_utente]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter fatores precipitantes:", err);
    res.status(500).json({ error: "Erro ao obter fatores precipitantes: " + err.message });
  }
});

// Endpoint para fatores de alívio
app.get("/api/resolving-factors/:n_utente", async (req, res) => {
  const { n_utente } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        rf.id,
        rf.id_symptom,
        rf.factor,
        rf.created_at
      FROM resolving_factor rf
      JOIN pain_symptom ps ON rf.id_symptom = ps.id
      WHERE ps.n_utente = $1
      ORDER BY rf.created_at DESC
    `, [n_utente]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter fatores de alívio:", err);
    res.status(500).json({ error: "Erro ao obter fatores de alívio: " + err.message });
  }
});

// Endpoint para sintomas associados
app.get("/api/associated-symptoms/:n_utente", async (req, res) => {
  const { n_utente } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        ass.id,
        ass.id_symptom,
        ass.name,
        ass.description,
        ass.occurrence,
        ass.severity,
        ass.created_at
      FROM associated_symptom ass
      JOIN pain_symptom ps ON ass.id_symptom = ps.id
      WHERE ps.n_utente = $1
      ORDER BY ass.created_at DESC
    `, [n_utente]);

    console.log(`Sintomas associados para n_utente ${n_utente}:`, result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter sintomas associados:", err);
    res.status(500).json({ error: "Erro ao obter sintomas associados: " + err.message });
  }
});


// Endpoint para achados de exame
app.get("/api/examination-findings/:n_utente", async (req, res) => {
  const { n_utente } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        ef.id,
        ef.id_symptom,
        ef.system_examined,
        ef.created_at
      FROM examination_findings ef
      JOIN pain_symptom ps ON ef.id_symptom = ps.id
      WHERE ps.n_utente = $1
      ORDER BY ef.created_at DESC
    `, [n_utente]);

    console.log(`Achados de exame para n_utente ${n_utente}:`, result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter achados de exame:", err);
    res.status(500).json({ error: "Erro ao obter achados de exame: " + err.message });
  }
});

// Endpoint para arquivos de media
app.get("/api/media-files/:n_utente", async (req, res) => {
  const { n_utente } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        mf.id,
        mf.id_exam_findings,
        mf.file_dir,
        mf.content_name,
        mf.created_at
      FROM media_files mf
      JOIN examination_findings ef ON mf.id_exam_findings = ef.id
      JOIN pain_symptom ps ON ef.id_symptom = ps.id
      WHERE ps.n_utente = $1
      ORDER BY mf.created_at DESC
    `, [n_utente]);

    console.log(`Arquivos de media para n_utente ${n_utente}:`, result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter arquivos de media:", err);
    res.status(500).json({ error: "Erro ao obter arquivos de media: " + err.message });
  }
});

// Endpoint para avaliação PHQ-9
app.get("/api/phq9/:n_utente", async (req, res) => {
  const { n_utente } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        phq.id,
        phq.id_symptom,
        phq.sleep_issues,
        phq.tiredness,
        phq.appetite,
        phq.concentration,
        phq.self_harm_thoughts,
        phq.life_difficulty,
        phq.date,
        phq.time,
        phq.created_at
      FROM phq9 phq
      JOIN pain_symptom ps ON phq.id_symptom = ps.id
      WHERE ps.n_utente = $1
      ORDER BY phq.created_at DESC
    `, [n_utente]);

    console.log(`Avaliação PHQ-9 para n_utente ${n_utente}:`, result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter avaliação PHQ-9:", err);
    res.status(500).json({ error: "Erro ao obter avaliação PHQ-9: " + err.message });
  }
});


// Endpoint para histórico de medicação
app.get("/api/medication-history/:n_utente", async (req, res) => {
  const { n_utente } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM patient_medication WHERE n_utente = $1 ORDER BY created_at DESC",
      [n_utente]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter histórico de medicação:", err);
    res.status(500).json({ error: "Erro ao obter histórico de medicação" });
  }
});


async function sendToMirthConnect(n_utente, formType, recordId, bundle) {
  try {
    console.debug(`Sending FHIR Bundle to Mirth: ${mirthConfig.url}, n_utente: ${n_utente}, form: ${formType}, record: ${recordId}`);
    // console.log(`Conteúdo do Bundle enviado para Mirth: ${JSON.stringify(bundle, null, 2)}`);
    const response = await axios.post(mirthConfig.url, bundle, { headers: mirthConfig.headers });
    console.log(`FHIR Bundle sent to Mirth Connect for n_utente ${n_utente}, form ${formType}, record ${recordId}:`, response.data);
    return response.data;
  } catch (err) {
    const errorMessage = err.response
      ? `Mirth error: ${err.response.status} - ${JSON.stringify(err.response.data)}`
      : `Mirth connection failed: ${err.message || 'Unknown error'}`;
    console.error(`Error sending FHIR Bundle to Mirth Connect for n_utente ${n_utente}, form ${formType}, record ${recordId}: ${errorMessage}`);
    throw new Error(`Failed to send to Mirth Connect: ${errorMessage}`);
  }
}

// Endpoint to export FHIR Bundle for a specific form
app.post('/api/fhir/export', async (req, res) => {
  const { n_utente, form_type, record_id } = req.body;

  // Validate input
  if (!n_utente || typeof n_utente !== 'string' || n_utente.trim() === '') {
    return res.status(400).json({ error: 'n_utente inválido' });
  }
  if (!form_type || !['personal_info', 'pain', 'medication'].includes(form_type)) {
    return res.status(400).json({ error: 'form_type inválido. Use: personal_info, pain, medication' });
  }
  if (!record_id || typeof record_id !== 'string' || record_id.trim() === '') {
    return res.status(400).json({ error: 'record_id inválido' });
  }

  try {
    let bundle;

    // Generate Bundle based on form type
    switch (form_type) {
      case 'personal_info':
        bundle = await createPersonalInfoBundle(pool, n_utente);
        break;
      case 'pain':
        bundle = await createPainBundle(pool, n_utente, record_id);
        break;
      case 'medication':
        bundle = await createMedicationBundle(pool, n_utente, record_id);
        break;
      default:
        throw new Error('Form type not supported');
    }

    // console.log(`Bundle gerado para n_utente ${n_utente}, form ${form_type}, record ${record_id}: ${JSON.stringify(bundle, null, 2)}`);

    // Check if Bundle has entries
    if (bundle.entry.length === 0) {
      return res.status(404).json({ error: `No data found for n_utente ${n_utente}, form ${form_type}, record ${record_id}` });
    }

    // Send to Mirth Connect
    const mirthResponse = await sendToMirthConnect(n_utente, form_type, record_id, bundle);

    // Return Mirth response and optionally the Bundle
    res.json({
      message: `FHIR Bundle sent to Mirth Connect for n_utente ${n_utente}, form ${form_type}, record ${record_id}`,
      mirthResponse,
      bundle, // Optional: Include for frontend preview or debugging
    });
  } catch (err) {
    console.error(`Error processing FHIR Bundle for n_utente ${n_utente}, form ${form_type}, record ${record_id}:`, err);
    res.status(500).json({ error: `Failed to process FHIR Bundle: ${err.message}` });
  }
});


// Subscribe endpoint
app.post('/api/push/subscribe', async (req, res) => {
  const { subscription, n_utente, notification_hour } = req.body;
  if (!subscription || !n_utente) {
    return res.status(400).json({ error: 'Subscrição ou n_utente em falta' });
  }
  try {
    await pool.query(
      `INSERT INTO push_preferences (n_utente, notification_hour, subscription)
       VALUES ($1, $2, $3)
       ON CONFLICT (n_utente) DO UPDATE
       SET subscription = $3, notification_hour = $2, created_at = CURRENT_TIMESTAMP`,
      [n_utente, notification_hour, subscription]
    );
    console.log(`Utente ${n_utente} subscrito com a hora ${notification_hour}`);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Erro ao guardar a subscrição:', err);
    res.status(500).json({ error: 'Falha ao guardar a subscrição' });
  }
  await scheduleReminders(); // Re-schedule after new subscription
});


// Update notification preferences
app.post('/api/push/preferences', async (req, res) => {
  const { n_utente, notification_hour } = req.body;
  if (!n_utente || notification_hour == null || notification_hour < 0 || notification_hour > 23) {
    return res.status(400).json({ error: 'n_utente ou notification_hour inválido' });
  }
  try {
    const result = await pool.query(
      `UPDATE push_preferences SET notification_hour = $1, updated_at = CURRENT_TIMESTAMP
       WHERE n_utente = $2 RETURNING *`,
      [notification_hour, n_utente]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Nenhuma subscrição foi encontrda para o n_utente' });
    }
    console.log(`Preferências atualizadas para o utente ${n_utente}: ${notification_hour}`);
    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao atualizar as preferências:', err);
    res.status(500).json({ error: 'Falha ao atualizar as preferências' });
  }
  await scheduleReminders(); // Re-schedule after preference update
});


// Endpoint para aceder às preferências de notificação
app.get('/api/push/preferences/:n_utente', async (req, res) => {
  const { n_utente } = req.params;
  try {
    const result = await pool.query(
      'SELECT notification_hour FROM push_preferences WHERE n_utente = $1',
      [n_utente]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nenhuma preferência encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro na pesquisa de preferências:', err);
    res.status(500).json({ error: 'Falha na pesquisa de preferências' });
  }
});


// Iniciar servidor
app.listen(port, () => {
  console.log(`Backend a correr em http://localhost:${port}`);
});

