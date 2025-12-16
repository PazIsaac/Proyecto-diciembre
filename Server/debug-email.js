const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'DataBase', 'veterinaria.db');
const db = new sqlite3.Database(dbPath);

db.get('SELECT email FROM usuarios WHERE id = 1', (err, row) => {
    if (err) {
        console.error('❌ Error:', err.message);
    } else if (row) {
        const email = row.email;
        console.log('📧 Email en BD:', JSON.stringify(email));
        console.log('📧 Length:', email.length);
        console.log('📧 Chars:', email.split('').map(c => `${c}(${c.charCodeAt(0)})`));
        
        // Comparar con el email que estamos usando
        const testEmail = 'aarontec.tarea@gmail.com';
        console.log('\n📧 Email test:', JSON.stringify(testEmail));
        console.log('📧 Match:', email === testEmail);
        console.log('📧 Trimmed match:', email.trim() === testEmail.trim());
    }
    db.close();
});