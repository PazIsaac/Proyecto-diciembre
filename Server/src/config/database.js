const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Usar la base de datos existente en DataBase
const dbPath = path.join(__dirname, '../DataBase/veterinaria.db');

// Verificar que el directorio existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Crear conexión SQLite
const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error('❌ Database connection failed:', error.message);
    } else {
        console.log('✅ Database connection established successfully.');
        
        // Crear tablas si no existen
        db.run(`CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            contraseña TEXT NOT NULL,
            rol TEXT DEFAULT 'cliente',
            verificado INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS turnos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            fecha DATE NOT NULL,
            hora TIME NOT NULL,
            motivo TEXT NOT NULL,
            estado TEXT DEFAULT 'pendiente',
            notas TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            precio REAL NOT NULL,
            imagen TEXT,
            categoria TEXT,
            stock INTEGER DEFAULT 0,
            activo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            total REAL NOT NULL,
            estado TEXT DEFAULT 'pendiente',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS pedido_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido_id INTEGER NOT NULL,
            producto_id INTEGER NOT NULL,
            cantidad INTEGER NOT NULL,
            precio_unitario REAL NOT NULL,
            FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
            FOREIGN KEY (producto_id) REFERENCES productos(id)
        )`);
        
        // Insertar productos iniciales
        db.get('SELECT COUNT(*) as count FROM productos', (err, row) => {
            if (!err && row.count === 0) {
                const productos = [
                    ['Bozal de Seguridad', 'Bozal cómodo y seguro para perros', 15.99, 'bozal.png', 'Accesorios', 10],
                    ['Casita para Perro', 'Casa cómoda y resistente para mascotas', 89.99, 'casita perro.png', 'Hogar', 5],
                    ['Collar Premium', 'Collar resistente y elegante', 25.50, 'collar1.jpg', 'Accesorios', 15],
                    ['Cono Protector', 'Cono de recuperación post-cirugía', 12.99, 'Cono de la verguenza.png', 'Médico', 8],
                    ['Set Juguete y Collar', 'Combo de juguete y collar para cachorros', 18.75, 'juguete y collar.jpg', 'Juguetes', 12],
                    ['Manta Térmica', 'Manta térmica para mascotas', 35.00, 'manta terimica.png', 'Confort', 6]
                ];
                
                productos.forEach(([nombre, descripcion, precio, imagen, categoria, stock]) => {
                    db.run('INSERT INTO productos (nombre, descripcion, precio, imagen, categoria, stock) VALUES (?, ?, ?, ?, ?, ?)',
                        [nombre, descripcion, precio, imagen, categoria, stock]);
                });
                
                console.log('✅ Productos iniciales creados');
            }
        });
    }
});

// Función para probar la conexión
const testConnection = async () => {
    return new Promise((resolve) => {
        db.get('SELECT 1', (error) => {
            if (error) {
                console.error('❌ Database test failed:', error);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};

module.exports = { db, testConnection };