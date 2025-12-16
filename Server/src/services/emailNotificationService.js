const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuración del transportador de email
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'pethealth112@gmail.com',
            pass: process.env.EMAIL_PASS || 'tu_app_password_aqui'
        }
    });
};

// Obtener conexión a la base de datos
const getDatabase = () => {
    const dbPath = path.join(__dirname, '..', 'DataBase', 'veterinaria.db');
    return new sqlite3.Database(dbPath);
};

// Enviar email de recordatorio
const sendReminderEmail = async (userEmail, userName, appointmentData) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'veterinaria.pethealth@gmail.com',
            to: userEmail,
            subject: '🐾 Recordatorio de Cita - PetHealth Veterinaria',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #4CAF50, #27AE60); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🐾 PetHealth Veterinaria</h1>
                    </div>
                    
                    <div style="padding: 30px; background: #f9f9f9;">
                        <h2 style="color: #2c3e50;">¡Hola ${userName}!</h2>
                        
                        <p style="font-size: 16px; color: #555;">
                            Te recordamos que tienes una cita programada para <strong>${appointmentData.mascota_nombre}</strong>.
                        </p>
                        
                        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                            <h3 style="color: #4CAF50; margin-top: 0;">📅 Detalles de la Cita</h3>
                            <p><strong>Fecha:</strong> ${appointmentData.fecha}</p>
                            <p><strong>Hora:</strong> ${appointmentData.hora}</p>
                            <p><strong>Servicio:</strong> ${appointmentData.servicio}</p>
                            <p><strong>Mascota:</strong> ${appointmentData.mascota_nombre} (${appointmentData.mascota_tipo})</p>
                            ${appointmentData.observaciones ? `<p><strong>Observaciones:</strong> ${appointmentData.observaciones}</p>` : ''}
                        </div>
                        
                        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; color: #2d5a3d;">
                                <strong>💡 Recordatorio:</strong> Por favor llega 10 minutos antes de tu cita.
                            </p>
                        </div>
                        
                        <p style="color: #666; font-size: 14px;">
                            Si necesitas reprogramar o cancelar tu cita, contáctanos lo antes posible.
                        </p>
                    </div>
                    
                    <div style="background: #2c3e50; padding: 20px; text-align: center; color: white;">
                        <p style="margin: 0;">📞 Teléfono: (123) 456-7890</p>
                        <p style="margin: 5px 0 0 0;">📧 Email: info@pethealth.com</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email enviado a ${userEmail} para cita del ${appointmentData.fecha}`);
        return true;
    } catch (error) {
        console.error('❌ Error enviando email:', error.message);
        return false;
    }
};

// Buscar citas próximas (24 horas antes)
const checkUpcomingAppointments = async () => {
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        
        // Buscar citas para mañana
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        const query = `
            SELECT 
                t.id,
                t.fecha,
                t.hora,
                t.servicio,
                t.mascota_nombre,
                t.mascota_tipo,
                t.observaciones,
                u.nombre,
                u.apellido,
                u.email
            FROM turnos t
            JOIN usuarios u ON t.usuario_id = u.id
            WHERE t.fecha = ? AND t.estado = 'pendiente'
        `;
        
        db.all(query, [tomorrowStr], (err, rows) => {
            if (err) {
                console.error('❌ Error consultando citas:', err.message);
                reject(err);
            } else {
                console.log(`📋 Encontradas ${rows.length} citas para mañana (${tomorrowStr})`);
                resolve(rows);
            }
            db.close();
        });
    });
};

// Procesar envío de recordatorios
const processReminders = async () => {
    try {
        console.log('🔍 Verificando citas próximas...');
        const appointments = await checkUpcomingAppointments();
        
        if (appointments.length === 0) {
            console.log('ℹ️ No hay citas para recordar hoy');
            return;
        }
        
        for (const appointment of appointments) {
            const userName = `${appointment.nombre} ${appointment.apellido}`;
            await sendReminderEmail(appointment.email, userName, appointment);
            
            // Esperar 1 segundo entre emails para evitar spam
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`🎉 Procesados ${appointments.length} recordatorios`);
    } catch (error) {
        console.error('❌ Error procesando recordatorios:', error.message);
    }
};

module.exports = {
    sendReminderEmail,
    checkUpcomingAppointments,
    processReminders
};