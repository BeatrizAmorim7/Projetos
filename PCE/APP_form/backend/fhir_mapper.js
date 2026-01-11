const { v4: uuidv4 } = require('uuid');

function toFHIRPatient(personalInfo, addresses, contacts) {
  return {
    resourceType: 'Patient',
    id: personalInfo.n_utente,
    name: [
      {
        text: personalInfo.name || 'Unknown',
      },
    ],
    gender: personalInfo.gender?.toLowerCase() || 'unknown',
    address: addresses.map(addr => ({
      line: [addr.address_line].filter(Boolean),
      city: addr.city,
      state: addr.district,
      postalCode: addr.postal_code,
      country: addr.country,
    })),
    telecom: contacts.map(cont => ({
      value: cont.communication_value,
    })),
    meta: {
      lastUpdated: personalInfo.created_at.toISOString(),
    },
  };
}

function toFHIRConditionDiagnosis(diagnosis, n_utente) {
  const context = { id: diagnosis.id, n_utente };
  return {
    resourceType: 'Condition',
    id: diagnosis.id,
    subject: {
      reference: `Patient/${n_utente}`,
    },
    code: {
      text: diagnosis.name,
    },
    onsetDateTime: (() => {
      if (diagnosis.onset_date) {
        const dateStr = formatDateToYMD(diagnosis.onset_date);
        const timeStr = diagnosis.onset_time ? diagnosis.onset_time.replace(/(\d{2}:\d{2}:\d{2})\.\d+/, '$1') : '00:00:00';
        return parseDateSafely(`${dateStr}T${timeStr}`, diagnosis.created_at, context);
      }
      return undefined;
    })(),
    abatementDateTime: (() => {
      if (diagnosis.resolution_date) {
        const dateStr = formatDateToYMD(diagnosis.resolution_date);
        const timeStr = diagnosis.resolution_time ? diagnosis.resolution_time.replace(/(\d{2}:\d{2}:\d{2})\.\d+/, '$1') : '00:00:00';
        return parseDateSafely(`${dateStr}T${timeStr}`, diagnosis.created_at, context); // Use created_at as fallback
      }
      return undefined;
    })(),
    severity: diagnosis.severity
      ? {
          text: diagnosis.severity,
        }
      : undefined,
    recordedDate: diagnosis.created_at.toISOString(),
  };
}

function toFHIRConditionPain(painSymptom, bodySites, n_utente) {
  return {
    resourceType: 'Condition',
    id: painSymptom.id,
    subject: {
      reference: `Patient/${n_utente}`,
    },
    code: {
      text: painSymptom.name,
    },
    bodySite: bodySites.map(site => ({
      text: site.body_site,
    })),
    note: painSymptom.description ? [{ text: painSymptom.description }] : undefined,
    recordedDate: painSymptom.created_at.toISOString(),
  };
}

function toFHIRObservationFactor(factor, type, id_symptom, n_utente) {
  return {
    resourceType: 'Observation',
    id: factor.id,
    status: 'final',
    code: {
      text: type === 'precipitating' ? 'Precipitating Factor' : 'Resolving Factor',
    },
    subject: {
      reference: `Patient/${n_utente}`,
    },
    focus: [
      {
        reference: `Condition/${id_symptom}`,
      },
    ],
    valueString: factor.factor,
    effectiveDateTime: factor.created_at.toISOString(),
  };
}

function toFHIRConditionAssociatedSymptom(assocSymptom, id_symptom, n_utente) {
  return {
    resourceType: 'Condition',
    id: assocSymptom.id,
    subject: {
      reference: `Patient/${n_utente}`,
    },
    code: {
      text: assocSymptom.name,
    },
    severity: assocSymptom.severity
      ? {
          text: assocSymptom.severity,
        }
      : undefined,
    note: assocSymptom.description ? [{ text: assocSymptom.description }] : undefined,
    related: [
      {
        type: 'due-to',
        target: {
          reference: `Condition/${id_symptom}`,
        },
      },
    ],
    recordedDate: assocSymptom.created_at.toISOString(),
  };
}

// Helper function to safely parse dates
function parseDateSafely(dateInput, fallback, context = {}) {
  try {
    let date;
    if (typeof dateInput === 'string') {
      // Handle time strings with microseconds (e.g., 15:34:08.422335)
      const sanitizedInput = dateInput.replace(/(\d{2}:\d{2}:\d{2})\.\d+/, '$1');
      date = new Date(sanitizedInput);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      throw new Error(`Invalid date input type: ${typeof dateInput}`);
    }
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date value');
    }
    return date.toISOString();
  } catch (err) {
    console.warn(
      `Date parsing failed: ${err.message}, input: ${dateInput}, context: ${JSON.stringify(context)}`
    );
    return fallback ? parseDateSafely(fallback, null, context) : null;
  }
}

// Helper function to format date to YYYY-MM-DD
function formatDateToYMD(dateInput) {
  if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateInput;
  }
  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
    return dateInput.toISOString().split('T')[0];
  }
  return null;
}

function toFHIRObservationAbbeyPainScale(abbey, id_symptom, n_utente) {
  const context = { id: abbey.id, id_symptom, n_utente };
  let effectiveDateTime = null;
  let dateStr = formatDateToYMD(abbey.date);
  let timeStr = null;

  // Handle time (string, microseconds)
  if (abbey.time && typeof abbey.time === 'string') {
    const timeMatch = abbey.time.match(/^(\d{2}:\d{2}:\d{2})(\.\d+)?$/);
    if (timeMatch) {
      timeStr = timeMatch[1]; // Use HH:mm:ss
    } else {
      console.warn(`Invalid abbey.time format: ${abbey.time}`, context);
    }
  }

  // Combine date and time if valid
  if (dateStr) {
    timeStr = timeStr || '00:00:00';
    effectiveDateTime = parseDateSafely(`${dateStr}T${timeStr}`, null, context);
  }

  // Fallback to created_at
  if (!effectiveDateTime) {
    effectiveDateTime = parseDateSafely(abbey.created_at, null, context);
  }

  if (!effectiveDateTime) {
    console.warn(`Skipping abbey_pain_scale record ${abbey.id} due to invalid date`, context);
    return null;
  }

  return {
    resourceType: 'Observation',
    id: abbey.id,
    status: 'final', // 'final' for completed observations
    code: {
      text: 'Abbey Pain Scale',
    },
    subject: {
      reference: `Patient/${n_utente}`,
    },
    focus: [
      {
        reference: `Condition/${id_symptom}`,
      },
    ],
    valueString: abbey.pain_score_category,
    component: abbey.pain_type
      ? [
          {
            code: {
              text: 'Pain Type',
            },
            valueString: abbey.pain_type,
          },
        ]
      : undefined,
    effectiveDateTime,
  };
}

function toFHIRObservationPHQ9(phq9, id_symptom, n_utente) {
  const context = { id: phq9.id, id_symptom, n_utente };

  let effectiveDateTime = null;
  let dateStr = formatDateToYMD(phq9.date);
  let timeStr = null;

  // Handle time (string, microseconds)
  if (phq9.time && typeof phq9.time === 'string') {
    const timeMatch = phq9.time.match(/^(\d{2}:\d{2}:\d{2})(\.\d+)?$/);
    if (timeMatch) {
      timeStr = timeMatch[1]; // Use HH:mm:ss
    } else {
      console.warn(`Invalid phq9.time format: ${phq9.time}`, context);
    }
  }

  // Combine date and time if valid
  if (dateStr) {
    timeStr = timeStr || '00:00:00';
    effectiveDateTime = parseDateSafely(`${dateStr}T${timeStr}`, null, context);
  }

  // Fallback to created_at
  if (!effectiveDateTime) {
    effectiveDateTime = parseDateSafely(phq9.created_at, null, context);
  }

  if (!effectiveDateTime) {
    console.warn(`Skipping phq9 record ${phq9.id} due to invalid date`, context);
    return null;
  }
  return {
    resourceType: 'Observation',
    id: phq9.id,
    status: 'final',
    code: {
      text: 'PHQ-9 Assessment',
    },
    subject: {
      reference: `Patient/${n_utente}`,
    },
    focus: [
      {
        reference: `Condition/${id_symptom}`,
      },
    ],
    component: [
      phq9.sleep_issues && {
        code: { text: 'Sleep Issues' },
        valueString: phq9.sleep_issues,
      },
      phq9.tiredness && {
        code: { text: 'Tiredness' },
        valueString: phq9.tiredness,
      },
      phq9.appetite && {
        code: { text: 'Appetite' },
        valueString: phq9.appetite,
      },
      phq9.concentration && {
        code: { text: 'Concentration' },
        valueString: phq9.concentration,
      },
      phq9.self_harm_thoughts && {
        code: { text: 'Self-Harm Thoughts' },
        valueString: phq9.self_harm_thoughts,
      },
      phq9.life_difficulty && {
        code: { text: 'Life Difficulty' },
        valueString: phq9.life_difficulty,
      },
    ].filter(Boolean),
    effectiveDateTime,
  };
}

function toFHIRObservationExaminationFindings(exam, id_symptom, n_utente) {
  return {
    resourceType: 'Observation',
    id: exam.id,
    status: 'final',
    code: {
      text: 'Examination Finding',
    },
    subject: {
      reference: `Patient/${n_utente}`,
    },
    focus: [
      {
        reference: `Condition/${id_symptom}`,
      },
    ],
    valueString: exam.system_examined,
    effectiveDateTime: exam.created_at.toISOString(),
  };
}

function toFHIRDocumentReference(media, id_exam_findings, n_utente) {
  return {
    resourceType: 'DocumentReference',
    id: media.id,
    status: 'current', // because is a current document
    subject: {
      reference: `Patient/${n_utente}`,
    },
    content: [
      {
        attachment: {
          title: media.content_name,
          url: media.file_dir,
          creation: media.created_at.toISOString(),
        },
      },
    ],
    context: {
      related: [
        {
          reference: `Observation/${id_exam_findings}`,
        },
      ],
    },
  };
}

function toFHIRMedicationStatement(medication, n_utente) {
  const now = new Date();
  const startDate = new Date(medication.created_at);
  let status = 'active'; // Padrão para medicação habitual (sem duração ou duração = 0)

  // Se duracao_administracao é um número positivo, calcula a data de término
  if (medication.duracao_administracao && !isNaN(medication.duracao_administracao) && medication.duracao_administracao > 0) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + medication.duracao_administracao);
    if (endDate < now) {
      status = 'completed'; // Marca como concluída se a data de término passou
    }
  }
  return {
    resourceType: 'MedicationStatement',
    id: medication.id,
    status: medication.duracao_administracao ? 'active' : 'completed',
    subject: {
      reference: `Patient/${n_utente}`,
    },
    medicationCodeableConcept: {
      text: medication.nome_medicamento,
    },
    dosage: [
      {
        text: medication.dose,
      },
    ],
    effectiveDateTime: medication.created_at.toISOString(),
  };
}

// New function to create a Bundle for the Personal Info form
async function createPersonalInfoBundle(pool, n_utente) {
  const bundle = {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [],
  };

  const personalInfoResult = await pool.query(
    'SELECT * FROM personal_info WHERE n_utente = $1',
    [n_utente]
  );
  if (personalInfoResult.rows.length > 0) {
    const personalInfo = personalInfoResult.rows[0];
    const addressesResult = await pool.query('SELECT * FROM address WHERE n_utente = $1', [n_utente]);
    const contactsResult = await pool.query('SELECT * FROM contact WHERE n_utente = $1', [n_utente]);
    const diagnosesResult = await pool.query('SELECT * FROM diagnosis WHERE n_utente = $1', [n_utente]);

    bundle.entry.push({ resource: toFHIRPatient(personalInfo, addressesResult.rows, contactsResult.rows) });
    diagnosesResult.rows.forEach(diagnosis => {
      bundle.entry.push({ resource: toFHIRConditionDiagnosis(diagnosis, n_utente) });
    });
  }

  return bundle;
}

// Function to create a Bundle for the Pain form
async function createPainBundle(pool, n_utente, painSymptomId) {
  const bundle = {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [],
  };

  const painSymptomResult = await pool.query(
    'SELECT * FROM pain_symptom WHERE id = $1 AND n_utente = $2',
    [painSymptomId, n_utente]
  );
  if (painSymptomResult.rows.length > 0) {
    const painSymptom = painSymptomResult.rows[0];
    const bodySitesResult = await pool.query('SELECT * FROM body_sites WHERE id_symptom = $1', [painSymptomId]);
    bundle.entry.push({ resource: toFHIRConditionPain(painSymptom, bodySitesResult.rows, n_utente) });

    const precipitatingFactorsResult = await pool.query(
      'SELECT * FROM precipitating_factor WHERE id_symptom = $1',
      [painSymptomId]
    );
    precipitatingFactorsResult.rows.forEach(factor => {
      bundle.entry.push({ resource: toFHIRObservationFactor(factor, 'precipitating', painSymptomId, n_utente) });
    });

    const resolvingFactorsResult = await pool.query(
      'SELECT * FROM resolving_factor WHERE id_symptom = $1',
      [painSymptomId]
    );
    resolvingFactorsResult.rows.forEach(factor => {
      bundle.entry.push({ resource: toFHIRObservationFactor(factor, 'resolving', painSymptomId, n_utente) });
    });

    const associatedSymptomsResult = await pool.query(
      'SELECT * FROM associated_symptom WHERE id_symptom = $1',
      [painSymptomId]
    );
    associatedSymptomsResult.rows.forEach(symptom => {
      bundle.entry.push({ resource: toFHIRConditionAssociatedSymptom(symptom, painSymptomId, n_utente) });
    });

    const abbeyResult = await pool.query('SELECT * FROM abbey_pain_scale WHERE id_symptom = $1', [painSymptomId]);
    abbeyResult.rows.forEach(abbey => {
      const resource = toFHIRObservationAbbeyPainScale(abbey, painSymptomId, n_utente);
      if (resource) {
        bundle.entry.push({ resource });
      }
    });

    const phq9Result = await pool.query('SELECT * FROM phq9 WHERE id_symptom = $1', [painSymptomId]);
    phq9Result.rows.forEach(phq9 => {
      const resource = toFHIRObservationPHQ9(phq9, painSymptomId, n_utente);
      if (resource) {
        bundle.entry.push({ resource });
      }
    });

    const examFindingsResult = await pool.query(
      'SELECT * FROM examination_findings WHERE id_symptom = $1',
      [painSymptomId]
    );
    for (const exam of examFindingsResult.rows) {
      bundle.entry.push({ resource: toFHIRObservationExaminationFindings(exam, painSymptomId, n_utente) });

      const mediaResult = await pool.query('SELECT * FROM media_files WHERE id_exam_findings = $1', [exam.id]);
      mediaResult.rows.forEach(media => {
        bundle.entry.push({ resource: toFHIRDocumentReference(media, exam.id, n_utente) });
      });
    }
  }

  console.log(`Bundle completo gerado (fhir_mapper.js/createPainBundle): ${JSON.stringify(bundle, null, 2)}`);
  return bundle;
}

// New function to create a Bundle for the Medication form
async function createMedicationBundle(pool, n_utente, medicationId) {
  const bundle = {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [],
  };

  const medicationResult = await pool.query(
    'SELECT * FROM patient_medication WHERE id = $1 AND n_utente = $2',
    [medicationId, n_utente]
  );
  if (medicationResult.rows.length > 0) {
    const medication = medicationResult.rows[0];
    bundle.entry.push({ resource: toFHIRMedicationStatement(medication, n_utente) });
  }

  return bundle;
}

module.exports = {
  toFHIRPatient,
  toFHIRConditionDiagnosis,
  toFHIRConditionPain,
  toFHIRObservationFactor,
  toFHIRConditionAssociatedSymptom,
  toFHIRObservationAbbeyPainScale,
  toFHIRObservationPHQ9,
  toFHIRObservationExaminationFindings,
  toFHIRDocumentReference,
  toFHIRMedicationStatement,
  createPersonalInfoBundle,
  createPainBundle,
  createMedicationBundle,
};
