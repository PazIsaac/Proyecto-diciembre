const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ruta de la base de datos
const dbDir = path.join(__dirname, '..', 'DataBase');
const dbPath = path.join(dbDir, 'veterinaria.db');

// Crear directorio si no existe
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('📁 Directorio de base de datos creado');
}

// Crear conexión
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to SQLite database');
});

// Crear tablas
const createTables = () => {
    return new Promise((resolve, reject) => {
        let tablesCreated = 0;
        const totalTables = 2;

        // Tabla usuarios
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                apellido TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                contraseña TEXT NOT NULL,
                telefono TEXT,
                direccion TEXT,
                fecha_nacimiento DATE,
                genero TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('❌ Error creating usuarios table:', err.message);
                reject(err);
            } else {
                console.log('✅ Tabla usuarios creada/verificada');
                tablesCreated++;
                if (tablesCreated === totalTables) resolve();
            }
        });

        // Tabla turnos
        db.run(`
            CREATE TABLE IF NOT EXISTS turnos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                fecha DATE NOT NULL,
                hora TIME NOT NULL,
                servicio TEXT NOT NULL,
                mascota_nombre TEXT NOT NULL,
                mascota_tipo TEXT NOT NULL,
                observaciones TEXT,
                estado TEXT DEFAULT 'pendiente',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
            )
        `, (err) => {
            if (err) {
                console.error('❌ Error creating turnos table:', err.message);
                reject(err);
            } else {
                console.log('✅ Tabla turnos creada/verificada');
                tablesCreated++;
                if (tablesCreated === totalTables) resolve();
            }
        });
    });
};

// Ejecutar migración
const runMigration = async () => {
    try {
        console.log('🗄️ Iniciando migración de base de datos...');
        await createTables();
        console.log('🎉 Migración completada exitosamente');
    } catch (error) {
        console.error('❌ Error en migración:', error.message);
        process.exit(1);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err.message);
            } else {
                console.log('✅ Base de datos cerrada correctamente');
            }
        });
    }
};

runMigration();