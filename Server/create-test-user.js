const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'DataBase', 'veterinaria.db');
const db = new sqlite3.Database(dbPath);

const createTestUser = async () => {
    try {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash('123456', 12);
        
        // Eliminar usuario existente si existe
        db.run('DELETE FROM usuarios WHERE email = ?', ['test@gmail.com'], (err) => {
            if (err) console.log('Error eliminando usuario:', err.message);
        });
        
        // Crear usuario de prueba
        db.run(
            'INSERT INTO usuarios (nombre, apellido, email, contraseña, created_at) VALUES (?, ?, ?, ?, ?)',
            ['Test', 'User', 'test@gmail.com', hashedPassword, new Date().toISOString()],
            function(err) {
                if (err) {
                    console.error('❌ Error creando usuario:', err.message);
                } else {
                    console.log('✅ Usuario de prueba creado:');
                    console.log('   Email: test@gmail.com');
                    console.log('   Contraseña: 123456');
                    console.log('   ID:', this.lastID);
                }
                db.close();
            }
        );
    } catch (error) {
        console.error('❌ Error:', error.message);
        db.close();
    }
};

createTestUser();