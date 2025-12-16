const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Verificar configuración del transportador
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email service is ready');
            return true;
        } catch (error) {
            console.error('❌ Email service error:', error);
            return false;
        }
    }

    // Enviar email de verificación de cuenta
    async sendVerificationEmail(user, token) {
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Verificar tu cuenta - VetCare 🐾',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #4a90e2, #357abd); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">🐾 VetCare</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px;">¡Bienvenido a nuestra familia!</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #2c3e50; margin-bottom: 20px;">Hola ${user.nombre},</h2>
                        
                        <p style="color: #6c757d; line-height: 1.6; margin-bottom: 25px;">
                            Gracias por registrarte en VetCare. Para completar tu registro y acceder a todos nuestros servicios, 
                            por favor verifica tu dirección de correo electrónico haciendo clic en el botón de abajo:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" 
                               style="background: #4a90e2; color: white; padding: 15px 30px; text-decoration: none; 
                                      border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                                Verificar mi cuenta ✅
                            </a>
                        </div>
                        
                        <p style="color: #6c757d; font-size: 14px; margin-top: 25px;">
                            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                            <a href="${verificationUrl}" style="color: #4a90e2; word-break: break-all;">${verificationUrl}</a>
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 25px 0;">
                        
                        <p style="color: #6c757d; font-size: 12px; text-align: center;">
                            Este enlace expirará en 24 horas por seguridad.<br>
                            Si no solicitaste esta cuenta, puedes ignorar este email.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
                        © ${new Date().getFullYear()} VetCare. Todos los derechos reservados.
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Verification email sent to ${user.email}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending verification email:', error);
            throw new Error('Failed to send verification email');
        }
    }

    // Enviar email de recuperación de contraseña
    async sendPasswordResetEmail(user, token) {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Recuperar contraseña - VetCare 🔐',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">🔐 Recuperar Contraseña</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px;">VetCare</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #2c3e50; margin-bottom: 20px;">Hola ${user.nombre},</h2>
                        
                        <p style="color: #6c757d; line-height: 1.6; margin-bottom: 25px;">
                            Recibimos una solicitud para restablecer la contraseña de tu cuenta. 
                            Si fuiste tú, haz clic en el botón de abajo para crear una nueva contraseña:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; 
                                      border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                                Restablecer Contraseña 🔑
                            </a>
                        </div>
                        
                        <p style="color: #6c757d; font-size: 14px; margin-top: 25px;">
                            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                            <a href="${resetUrl}" style="color: #e74c3c; word-break: break-all;">${resetUrl}</a>
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 25px 0;">
                        
                        <p style="color: #6c757d; font-size: 12px; text-align: center;">
                            Este enlace expirará en 1 hora por seguridad.<br>
                            Si no solicitaste este cambio, puedes ignorar este email.
                        </p>
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Password reset email sent to ${user.email}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }

    // Enviar alerta de stock bajo
    async sendLowStockAlert(product) {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmail,
            subject: `⚠️ Alerta de Stock Bajo - ${product.nombre}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">⚠️ Alerta de Stock</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px;">VetCare - Sistema de Inventario</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #2c3e50; margin-bottom: 20px;">Stock Bajo Detectado</h2>
                        
                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #856404; margin: 0 0 15px 0;">Detalles del Producto:</h3>
                            <p style="margin: 5px 0; color: #856404;"><strong>Nombre:</strong> ${product.nombre}</p>
                            <p style="margin: 5px 0; color: #856404;"><strong>Categoría:</strong> ${product.categoria}</p>
                            <p style="margin: 5px 0; color: #856404;"><strong>Stock Actual:</strong> ${product.stock} unidades</p>
                            <p style="margin: 5px 0; color: #856404;"><strong>Stock Mínimo:</strong> ${product.stockMinimo} unidades</p>
                            <p style="margin: 5px 0; color: #856404;"><strong>Precio:</strong> $${product.precio}</p>
                        </div>
                        
                        <p style="color: #6c757d; line-height: 1.6;">
                            El producto <strong>${product.nombre}</strong> ha alcanzado el nivel mínimo de stock. 
                            Se recomienda realizar un pedido de reposición lo antes posible para evitar desabastecimiento.
                        </p>
                        
                        <div style="text-align: center; margin: 25px 0;">
                            <p style="color: #e67e22; font-weight: bold; font-size: 18px;">
                                Acción Requerida: Reabastecer Inventario
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
                        Alerta generada automáticamente el ${new Date().toLocaleString('es-ES')}
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Low stock alert sent for product: ${product.nombre}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending low stock alert:', error);
            throw new Error('Failed to send low stock alert');
        }
    }
}

module.exports = new EmailService();