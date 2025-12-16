const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./src/Routes/auth.routes');
const turnosRoutes = require('./src/Routes/turnos.routes');
const registroRoutes = require('./src/Routes/RegistroUsuario.Routes');
const remindersRoutes = require('./src/Routes/reminders.routes');
const productsRoutes = require('./src/Routes/productsSQLite.routes');

app.use('/api/auth', authRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api', registroRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/products', productsRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running! 🚀', timestamp: new Date() });
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;