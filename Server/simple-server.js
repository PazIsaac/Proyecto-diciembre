const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3003;

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Base de datos
const dbPath = path.join(__dirname, 'src', 'DataBase', 'veterinaria.db');
const db = new sqlite3.Database(dbPath);

// JWT Secret
const JWT_SECRET = 'mi_clave_secreta_muy_segura_123';

// Ruta de login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, contraseña } = req.body;
        console.log('🔍 Login attempt:', { email, hasPassword: !!contraseña });

        if (!email || !contraseña) {
            return res.status(400).json({
                error: 'Email y contraseña son requeridos'
            });
        }

        // Buscar usuario
        db.get(
            'SELECT id, nombre, email, contraseña, rol, verificado FROM usuarios WHERE email = ?',
            [email],
            async (err, user) => {
                if (err) {
                    console.error('❌ Database error:', err);
                    return res.status(500).json({
                        error: 'Error interno del servidor'
                    });
                }

                if (!user) {
                    console.log('❌ User not found:', email);
                    return res.status(401).json({
                        error: 'Credenciales inválidas'
                    });
                }

                try {
                    // Verificar contraseña
                    const isValidPassword = await bcrypt.compare(contraseña, user.contraseña);
                    console.log('🔐 Password valid:', isValidPassword);

                    if (!isValidPassword) {
                        console.log('❌ Invalid password for:', email);
                        return res.status(401).json({
                            error: 'Credenciales inválidas'
                        });
                    }

                    // Generar token
                    const token = jwt.sign(
                        { id: user.id },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    console.log('✅ Login successful for:', email);

                    res.json({
                        message: 'Login exitoso',
                        token,
                        user: {
                            id: user.id,
                            nombre: user.nombre,
                            email: user.email,
                            rol: user.rol,
                            verificado: user.verificado
                        }
                    });

                } catch (bcryptError) {
                    console.error('❌ Bcrypt error:', bcryptError);
                    res.status(500).json({
                        error: 'Error interno del servidor'
                    });
                }
            }
        );

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// Ruta de registro
app.post('/api/auth/register', async (req, res) => {
    try {
        const { nombre, email, contraseña } = req.body;
        console.log('📝 Register attempt:', { nombre, email });

        if (!nombre || !email || !contraseña) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos'
            });
        }

        // Verificar si el usuario ya existe
        db.get('SELECT id FROM usuarios WHERE email = ?', [email], async (err, existingUser) => {
            if (err) {
                console.error('❌ Database error:', err);
                return res.status(500).json({
                    error: 'Error interno del servidor'
                });
            }

            if (existingUser) {
                return res.status(400).json({
                    error: 'El email ya está registrado'
                });
            }

            try {
                // Hash de la contraseña
                const hashedPassword = await bcrypt.hash(contraseña, 12);

                // Crear usuario
                db.run(
                    'INSERT INTO usuarios (nombre, email, contraseña, rol, verificado) VALUES (?, ?, ?, ?, ?)',
                    [nombre, email, hashedPassword, 'cliente', 1],
                    function(err) {
                        if (err) {
                            console.error('❌ Insert error:', err);
                            return res.status(500).json({
                                error: 'Error creando usuario'
                            });
                        }

                        console.log('✅ User created with ID:', this.lastID);

                        res.status(201).json({
                            message: 'Usuario registrado exitosamente',
                            user: {
                                id: this.lastID,
                                nombre,
                                email,
                                rol: 'cliente',
                                verificado: true
                            }
                        });
                    }
                );

            } catch (hashError) {
                console.error('❌ Hash error:', hashError);
                res.status(500).json({
                    error: 'Error interno del servidor'
                });
            }
        });

    } catch (error) {
        console.error('❌ Register error:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'Server is running! 🚀', 
        timestamp: new Date(),
        database: 'Connected'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor simple ejecutándose en http://localhost:${PORT}`);
    console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
    console.log('🔐 Endpoints disponibles:');
    console.log('   POST /api/auth/login');
    console.log('   POST /api/auth/register');
    console.log('');
    console.log('👤 Usuarios de prueba disponibles:');
    console.log('   Email: aarontec.tarea@gmail.com');
    console.log('   Password: 123456');
});