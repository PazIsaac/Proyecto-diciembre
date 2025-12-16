const SQLite= require('sqlite3').verbose();
const path= require('path');

const dbUbicacion= path.resolve(__dirname, 'Emails.db');

const db= new SQLite.Database(dbUbicacion, (Error)=>{
    if(Error){
        console.error('Error al conectar con la base de datos: ⛔', Error.message);
    }
    else{
        console.log('Conexión exitosa a la base de datos SQLite ✅');
        db.run(`CREATE TABLE IF NOT EXISTS Usuarios(
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Nombre TEXT NOT NULL,
            Email TEXT NOT NULL UNIQUE,
            Contraseña TEXT NOT NULL,
            Verificacion INTEGER NOT NULL DEFAULT 0,
            TokenEmail TEXT
        )`, (Error)=>{
            if(Error){
                console.error('Error al crear la tabla Usuarios: ⛔', Error.message);
            }
            else{
                console.log('Tabla Usuarios creada o ya existente ✅');
            }
        });
    }
})

module.exports= db;