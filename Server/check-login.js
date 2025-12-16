const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'DataBase', 'veterinaria.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Verificando contraseñas en la base de datos...\n');

db.all('SELECT id, nombre, email, contraseña FROM usuarios', (err, rows) => {
    if (err) {
        console.error('❌ Error:', err.message);
        db.close();
        return;
    }

    if (rows.length === 0) {
        console.log('⚠️ No hay usuarios registrados');
        db.close();
        return;
    }

    console.log(`✅ Encontrados ${rows.length} usuarios:\n`);
    
    rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.nombre} (${user.email})`);
        console.log(`   Contraseña hash: ${user.contraseña.substring(0, 20)}...`);
        console.log(`   ¿Es hash válido?: ${user.contraseña.startsWith('$2')}`);
        console.log('');
    });

    db.close();
});