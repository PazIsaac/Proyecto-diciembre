const bcrypt = require('bcryptjs');
const { db } = require('./src/config/database');

// Configuración
const EMAIL = 'aarontec.tarea@gmail.com'; // Cambia por el email que quieras
const NEW_PASSWORD = '123456'; // Cambia por la contraseña que quieras

async function resetPassword() {
    try {
        console.log('🔄 Actualizando contraseña...\n');

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 12);

        // Actualizar en la base de datos
        db.run(
            'UPDATE usuarios SET contraseña = ? WHERE email = ?',
            [hashedPassword, EMAIL],
            function(err) {
                if (err) {
                    console.error('❌ Error:', err.message);
                    return;
                }

                if (this.changes === 0) {
                    console.log('❌ No se encontró el usuario con ese email');
                } else {
                    console.log('✅ Contraseña actualizada exitosamente!');
                    console.log(`📧 Email: ${EMAIL}`);
                    console.log(`🔑 Nueva contraseña: ${NEW_PASSWORD}`);
                }

                db.close();
            }
        );

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

resetPassword();