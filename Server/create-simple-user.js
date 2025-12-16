const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'DataBase', 'veterinaria.db');
const db = new sqlite3.Database(dbPath);

async function createTestUser() {
    try {
        const email = 'test@test.com';
        const password = '123456';
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Eliminar usuario si existe
        db.run('DELETE FROM usuarios WHERE email = ?', [email], function(err) {
            if (err) {
                console.error('Error eliminando usuario:', err);
                return;
            }
            
            // Crear nuevo usuario
            db.run(
                'INSERT INTO usuarios (nombre, email, contraseña, rol, verificado) VALUES (?, ?, ?, ?, ?)',
                ['Usuario Test', email, hashedPassword, 'cliente', 1],
                function(err) {
                    if (err) {
                        console.error('Error creando usuario:', err);
                    } else {
                        console.log('✅ Usuario de prueba creado:');
                        console.log('   Email: test@test.com');
                        console.log('   Password: 123456');
                        console.log('   ID:', this.lastID);
                    }
                    db.close();
                }
            );
        });
        
    } catch (error) {
        console.error('Error:', error);
        db.close();
    }
}

createTestUser();