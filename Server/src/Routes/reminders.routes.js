const express = require('express');
const { runRemindersNow, checkUpcomingAppointments } = require('../services/emailNotificationService');
const router = express.Router();

// Ejecutar recordatorios manualmente (para pruebas)
router.post('/send-now', async (req, res) => {
    try {
        await runRemindersNow();
        res.json({ 
            success: true, 
            message: 'Recordatorios enviados exitosamente' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Error enviando recordatorios',
            details: error.message 
        });
    }
});

// Ver citas próximas sin enviar emails
router.get('/upcoming', async (req, res) => {
    try {
        const appointments = await checkUpcomingAppointments();
        res.json({ 
            success: true, 
            count: appointments.length,
            appointments 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Error consultando citas próximas',
            details: error.message 
        });
    }
});

module.exports = router;