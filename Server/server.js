const app = require('./app');
const { testConnection } = require('./src/config/database');
const { scheduleReminders } = require('./src/services/reminderScheduler');

const PORT = process.env.PORT || 3001;

// Iniciar servidor
const startServer = async () => {
    try {
        // Verificar conexión a la base de datos
        const isConnected = await testConnection();
        
        if (!isConnected) {
            console.error('❌ Cannot start server without database connection');
            process.exit(1);
        }

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 API Health: http://localhost:${PORT}/api/health`);
            console.log('📊 Run SQL script to create tables: src/config/createTables.sql');
            
            // Iniciar programador de recordatorios
            scheduleReminders();
            console.log('📧 Sistema de recordatorios por email activado');
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
};

startServer();