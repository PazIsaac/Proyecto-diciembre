const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

class AuthController {
    // Generar JWT token
    generateToken(userId) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET || 'mi_clave_secreta_muy_segura_123',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    }

    // Generar token de verificación
    generateVerificationToken() {
        return jwt.sign(
            { purpose: 'email_verification', timestamp: Date.now() },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    // Registro de usuario
    async register(req, res) {
        try {
            const { nombre, email, contraseña } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await new Promise((resolve, reject) => {
                db.get('SELECT id FROM usuarios WHERE email = ?', [email], (error, row) => {
                    if (error) reject(error);
                    else resolve(row);
                });
            });

            if (existingUser) {
                return res.status(400).json({
                    error: 'El email ya está registrado'
                });
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(contraseña, 12);

            // Crear usuario
            const result = await new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO usuarios (nombre, email, contraseña, rol, verificado) VALUES (?, ?, ?, ?, ?)',
                    [nombre, email, hashedPassword, 'cliente', 1],
                    function(error) {
                        if (error) reject(error);
                        else resolve({ insertId: this.lastID });
                    }
                );
            });

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: {
                    id: result.insertId,
                    nombre,
                    email,
                    rol: 'cliente',
                    verificado: true
                }
            });

        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Login de usuario
    async login(req, res) {
        try {
            const { email, contraseña } = req.body;
            console.log('🔍 Login attempt:', { email, hasPassword: !!contraseña });

            // Buscar usuario
            const user = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT id, nombre, email, contraseña, rol, verificado FROM usuarios WHERE email = ?',
                    [email],
                    (error, row) => {
                        if (error) reject(error);
                        else resolve(row);
                    }
                );
            });

            if (!user) {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(contraseña, user.contraseña);
            
            if (!isValidPassword) {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }

            // Generar token
            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET || 'mi_clave_secreta_muy_segura_123',
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

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

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Verificar email
    async verifyEmail(req, res) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({
                    error: 'Token de verificación requerido'
                });
            }

            // Verificar token
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (jwtError) {
                return res.status(400).json({
                    error: 'Token de verificación inválido o expirado'
                });
            }

            // Buscar usuario con este token
            const user = await User.findOne({ where: { tokenEmail: token } });
            if (!user) {
                return res.status(400).json({
                    error: 'Token de verificación inválido'
                });
            }

            // Verificar usuario
            user.verificado = true;
            user.tokenEmail = null;
            await user.save();

            res.json({
                message: 'Email verificado exitosamente. Ya puedes iniciar sesión.'
            });

        } catch (error) {
            console.error('Email verification error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Solicitar reset de contraseña
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                // Por seguridad, no revelar si el email existe
                return res.json({
                    message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña.'
                });
            }

            // Generar token de reset
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = resetTokenExpiry;
            await user.save();

            // Enviar email
            try {
                await emailService.sendPasswordResetEmail(user, resetToken);
            } catch (emailError) {
                console.error('Error sending password reset email:', emailError);
                return res.status(500).json({
                    error: 'Error enviando email de recuperación'
                });
            }

            res.json({
                message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña.'
            });

        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Restablecer contraseña
    async resetPassword(req, res) {
        try {
            const { token, contraseña } = req.body;

            const user = await User.findOne({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: {
                        [require('sequelize').Op.gt]: new Date()
                    }
                }
            });

            if (!user) {
                return res.status(400).json({
                    error: 'Token de reset inválido o expirado'
                });
            }

            // Actualizar contraseña
            user.contraseña = contraseña; // Se hasheará automáticamente por el hook
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            res.json({
                message: 'Contraseña restablecida exitosamente'
            });

        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Obtener perfil del usuario autenticado
    async getProfile(req, res) {
        try {
            res.json({
                user: {
                    id: req.user.id,
                    nombre: req.user.nombre,
                    email: req.user.email,
                    rol: req.user.rol,
                    verificado: req.user.verificado,
                    createdAt: req.user.createdAt,
                    updatedAt: req.user.updatedAt
                }
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
}

module.exports = new AuthController();