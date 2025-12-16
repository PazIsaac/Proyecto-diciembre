const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'DataBase', 'veterinaria.db');
const db = new sqlite3.Database(dbPath);

const email = 'aarontec.tarea@gmail.com';
const testPassword = '222222';

db.get('SELECT contraseña FROM usuarios WHERE email = ?', [email], async (err, row) => {
    if (err) {
        console.error('❌ Error:', err.message);
    } else if (!row) {
        console.log('❌ Usuario no encontrado');
    } else {
        console.log('🔐 Hash en BD:', row.contraseña);
        
        const isValid = await bcrypt.compare(testPassword, row.contraseña);
        console.log('✅ Contraseña válida:', isValid);
        
        // Probar otras contraseñas comunes
        const testPasswords = ['123456', 'aaron123', 'password', '111111'];
        for (const pwd of testPasswords) {
            const valid = await bcrypt.compare(pwd, row.contraseña);
            if (valid) {
                console.log(`✅ Contraseña correcta encontrada: ${pwd}`);
            }
        }
    }
    db.close();
});