const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración del proyecto...\n');

// Verificar archivos críticos
const criticalFiles = [
    { path: './package.json', name: 'Package.json' },
    { path: './server.js', name: 'Server.js' },
    { path: './app.js', name: 'App.js' },
    { path: './.env', name: 'Archivo .env' },
    { path: './src/config/database.js', name: 'Configuración de BD' },
    { path: './src/Controller/authController.js', name: 'Auth Controller' }
];

let allGood = true;

criticalFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
        console.log(`✅ ${file.name} - OK`);
    } else {
        console.log(`❌ ${file.name} - FALTA`);
        allGood = false;
    }
});

// Verificar directorio de base de datos
const dbDir = './src/DataBase';
if (fs.existsSync(dbDir)) {
    console.log('✅ Directorio de base de datos - OK');
} else {
    console.log('⚠️ Directorio de base de datos - CREANDO...');
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('✅ Directorio creado');
}

// Verificar node_modules
if (fs.existsSync('./node_modules')) {
    console.log('✅ Dependencias instaladas - OK');
} else {
    console.log('❌ Dependencias NO instaladas - Ejecutar: npm install');
    allGood = false;
}

console.log('\n' + '='.repeat(50));
if (allGood) {
    console.log('🎉 ¡Todo está configurado correctamente!');
    console.log('💡 Para iniciar: npm start');
} else {
    console.log('⚠️ Hay problemas de configuración');
    console.log('💡 Ejecutar: node install.js');
}
console.log('='.repeat(50));