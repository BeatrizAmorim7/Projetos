// PARA SIMULAR O ENVIO MANUAL DE NOTIFICAÇÕES PUSH
// na linha de comandos, no backkend, executar: node sendPushNow.js

const { Pool } = require("pg");
const webPush = require("web-push");

// Configurar a pool igual ao index.js
const pool = new Pool({
  user: "nextgen_user",
  host: "localhost",
  database: "pce_forms",
  password: "nextgen_password",
  port: 5432,
});

// VAPID keys iguais ao index.js
const vapidKeys = {
  publicKey: 'BBVGZH7ko7dK1cU9q131CRHE8QWLAbMdbB0elFAoUyZ2tKrotDkBNiAXK9itN5rBEGwwuBWuldakroDGhl8swLE',
  privateKey: 'QfV52OcDx-wcjuN_z4SP3VLAomvF2wMMCphz-yY5R-0',
};
webPush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Função para obter o nome do utente
async function getNomeUtente(n_utente) {
  try {
    const result = await pool.query(
      "SELECT name FROM personal_info WHERE n_utente = $1",
      [n_utente]
    );
    if (result.rows.length > 0 && result.rows[0].name) {
      return result.rows[0].name;
    }
    return n_utente;
  } catch (err) {
    return n_utente;
  }
}

// Função para enviar a notificação
async function sendReminder(n_utente, subscription) {
  const nomeUtente = await getNomeUtente(n_utente);
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
}

// --- EXECUÇÃO MANUAL ---

const nUtenteManual = '001'; // <-- colocar aqui o n_utente pretendido

(async () => {
  try {
    const result = await pool.query(
      'SELECT subscription FROM push_preferences WHERE n_utente = $1',
      [nUtenteManual]
    );
    if (result.rows.length === 0) {
      console.log('Subscrição não encontrada para este utente');
      process.exit(1);
    }
    const subscription = result.rows[0].subscription;
    await sendReminder(nUtenteManual, subscription);
    process.exit(0);
  } catch (err) {
    console.error('Erro ao enviar notificação manual:', err);
    process.exit(1);
  }
})();