const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando instalación automática del backend...\n');

// 1. Verificar Node.js
try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' });
    console.log('✅ Node.js detectado:', nodeVersion.trim());
} catch (error) {
    console.error('❌ Node.js no está instalado. Por favor instala Node.js primero.');
    process.exit(1);
}

// 2. Instalar dependencias
console.log('📦 Instalando dependencias...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencias instaladas correctamente\n');
} catch (error) {
    console.error('❌ Error instalando dependencias:', error.message);
    process.exit(1);
}

// 3. Crear archivo .env si no existe
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('⚙️ Creando archivo .env...');
    const envContent = `# Configuración del servidor
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024

# Base de datos SQLite
DB_PATH=./src/DataBase/veterinaria.db

# CORS
CORS_ORIGIN=http://localhost:5173
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Archivo .env creado\n');
}

// 4. Crear directorio de base de datos si no existe
const dbDir = path.join(__dirname, 'src', 'DataBase');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('✅ Directorio de base de datos creado\n');
}

// 5. Ejecutar migración de base de datos
console.log('🗄️ Configurando base de datos...');
try {
    execSync('npm run migrate', { stdio: 'inherit' });
    console.log('✅ Base de datos configurada correctamente\n');
} catch (error) {
    console.log('⚠️ Advertencia: Error en migración, pero continuando...\n');
}

console.log('🎉 ¡Instalación completada!');
console.log('\n📋 Para iniciar el servidor:');
console.log('   npm start     (producción)');
console.log('   npm run dev   (desarrollo con nodemon)');
console.log('\n🌐 El servidor estará disponible en: http://localhost:3001');