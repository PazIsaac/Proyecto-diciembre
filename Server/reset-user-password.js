const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'DataBase', 'veterinaria.db');
const db = new sqlite3.Database(dbPath);

const email = 'aarontec.tarea@gmail.com'; // Cambia por tu email
const newPassword = '123456'; // Nueva contraseña temporal

async function resetPassword() {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        db.run(
            'UPDATE usuarios SET contraseña = ? WHERE email = ?',
            [hashedPassword, email],
            function(err) {
                if (err) {
                    console.error('❌ Error:', err.message);
                } else if (this.changes === 0) {
                    console.log('⚠️ Usuario no encontrado');
                } else {
                    console.log(`✅ Contraseña actualizada para ${email}`);
                    console.log(`🔑 Nueva contraseña: ${newPassword}`);
                }
                db.close();
            }
        );
    } catch (error) {
        console.error('❌ Error:', error);
        db.close();
    }
}

resetPassword();