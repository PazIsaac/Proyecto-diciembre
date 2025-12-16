const cron = require('node-cron');
const { processReminders } = require('./emailNotificationService');

// Programar recordatorios diarios a las 9:00 AM
const scheduleReminders = () => {
    // Ejecutar todos los días a las 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('⏰ Ejecutando tarea programada de recordatorios...');
        await processReminders();
    }, {
        scheduled: true,
        timezone: "America/Argentina/Buenos_Aires"
    });
    
    console.log('📅 Programador de recordatorios iniciado - Ejecutará diariamente a las 9:00 AM');
};

// Ejecutar recordatorios manualmente (para pruebas)
const runRemindersNow = async () => {
    console.log('🚀 Ejecutando recordatorios manualmente...');
    await processReminders();
};

module.exports = {
    scheduleReminders,
    runRemindersNow
};