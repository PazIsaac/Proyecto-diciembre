const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'DataBase', 'veterinaria.db');
const db = new sqlite3.Database(dbPath);

async function testLogin() {
    console.log('🧪 Probando sistema de login...\n');
    
    // 1. Verificar usuarios existentes
    console.log('1️⃣ Verificando usuarios existentes:');
    db.all('SELECT id, nombre, email, rol FROM usuarios', (err, users) => {
        if (err) {
            console.error('❌ Error:', err.message);
            return;
        }
        
        if (users.length === 0) {
            console.log('⚠️ No hay usuarios. Creando usuario de prueba...');
            createTestUser();
        } else {
            console.log(`✅ Encontrados ${users.length} usuarios:`);
            users.forEach(user => {
                console.log(`   - ${user.nombre} (${user.email}) - ${user.rol}`);
            });
            
            // Probar login con el primer usuario
            if (users.length > 0) {
                testLoginWithUser(users[0].email);
            }
        }
    });
}

async function createTestUser() {
    const testUser = {
        nombre: 'Usuario Test',
        email: 'test@test.com',
        password: '123456'
    };
    
    try {
        const hashedPassword = await bcrypt.hash(testUser.password, 12);
        
        db.run(
            'INSERT INTO usuarios (nombre, email, contraseña, rol, verificado) VALUES (?, ?, ?, ?, ?)',
            [testUser.nombre, testUser.email, hashedPassword, 'cliente', 1],
            function(err) {
                if (err) {
                    console.error('❌ Error creando usuario:', err.message);
                } else {
                    console.log('✅ Usuario de prueba creado:');
                    console.log(`   Email: ${testUser.email}`);
                    console.log(`   Password: ${testUser.password}`);
                    console.log('');
                    testLoginWithUser(testUser.email);
                }
            }
        );
    } catch (error) {
        console.error('❌ Error hasheando contraseña:', error);
    }
}

async function testLoginWithUser(email) {
    console.log(`2️⃣ Probando login con: ${email}`);
    
    db.get(
        'SELECT id, nombre, email, contraseña, rol FROM usuarios WHERE email = ?',
        [email],
        async (err, user) => {
            if (err) {
                console.error('❌ Error buscando usuario:', err.message);
                return;
            }
            
            if (!user) {
                console.log('❌ Usuario no encontrado');
                return;
            }
            
            console.log('✅ Usuario encontrado en BD');
            
            // Probar contraseña
            const testPassword = '123456';
            try {
                const isValid = await bcrypt.compare(testPassword, user.contraseña);
                console.log(`🔐 Contraseña "${testPassword}" es válida: ${isValid ? '✅ SÍ' : '❌ NO'}`);
                
                if (isValid) {
                    console.log('🎉 ¡Login exitoso!');
                    console.log('📋 Datos del usuario:');
                    console.log(`   ID: ${user.id}`);
                    console.log(`   Nombre: ${user.nombre}`);
                    console.log(`   Email: ${user.email}`);
                    console.log(`   Rol: ${user.rol}`);
                }
            } catch (error) {
                console.error('❌ Error comparando contraseñas:', error);
            }
            
            db.close();
        }
    );
}

testLogin();