const bcrypt = require('bcryptjs');
const { db } = require('./src/config/database');

console.log('🔍 Verificando contraseñas de usuarios...\n');

// Obtener todos los usuarios
db.all('SELECT id, nombre, email, contraseña FROM usuarios', [], (err, users) => {
    if (err) {
        console.error('❌ Error:', err.message);
        return;
    }

    if (users.length === 0) {
        console.log('❌ No se encontraron usuarios');
        return;
    }

    console.log(`✅ Encontrados ${users.length} usuarios:\n`);

    users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   Nombre: ${user.nombre}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Contraseña hasheada: ${user.contraseña}`);
        
        // Verificar si la contraseña está hasheada correctamente
        const isHashed = user.contraseña.startsWith('$2a$') || user.contraseña.startsWith('$2b$');
        console.log(`   ¿Está hasheada?: ${isHashed ? '✅ Sí' : '❌ No'}`);
        console.log('');
    });

    // Cerrar la conexión
    db.close();
});