const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'DataBase', 'veterinaria.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Verificando usuarios en la base de datos...\n');

db.all('SELECT id, nombre, email, created_at FROM usuarios', (err, rows) => {
    if (err) {
        console.error('❌ Error:', err.message);
    } else if (rows.length === 0) {
        console.log('⚠️ No hay usuarios registrados en la base de datos');
    } else {
        console.log(`✅ Encontrados ${rows.length} usuarios:\n`);
        rows.forEach((user, index) => {
            console.log(`${index + 1}. ID: ${user.id}`);
            console.log(`   Nombre: ${user.nombre}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Creado: ${user.created_at}`);
            console.log('');
        });
    }
    db.close();
});