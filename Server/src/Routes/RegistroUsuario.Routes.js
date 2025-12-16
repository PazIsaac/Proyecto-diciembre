const Express = require('express')
const Rutas = Express.Router()

const { RegistrarNuevoUsuario } = require('../Controller/Registro.controller')
const { VerificacionToken } = require('../Utils/Token')

const db = require('../DataBase/db')

Rutas.post('/registrousuario', RegistrarNuevoUsuario)

Rutas.get('/verificacion/:Token', (req, res) => {
    const { Token } = req.params;
    console.log(req.params)
    try {
        const decoded = VerificacionToken(Token)
        query = 'UPDATE Usuarios SET Verificacion=1, TokenEmail=NULL WHERE Email=?';
        db.run(query, [decoded.Email], (Error) => {
            if (Error) {
                console.error('⛔ Error en la Verificación del Usuario')
                return res.status(500).send("Error al Verificar el Usuario")
            }
            res.send(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cuenta Verificada</title>
                <style>
                    body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #007bff, #00c6ff);
                    color: #333;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    }
                    .container {
                    background: white;
                    border-radius: 15px;
                    padding: 40px;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
                    text-align: center;
                    width: 90%;
                    max-width: 450px;
                    animation: fadeIn 1s ease-in-out;
                    }
                    .icon {
                    font-size: 70px;
                    color: #28a745;
                    margin-bottom: 15px;
                    animation: pop 0.8s ease;
                    }
                    h1 {
                    color: #28a745;
                    margin-bottom: 10px;
                    }
                    p {
                    color: #555;
                    font-size: 16px;
                    line-height: 1.6;
                    }
                    a {
                    display: inline-block;
                    margin-top: 25px;
                    padding: 12px 25px;
                    background: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    transition: 0.3s;
                    }
                    a:hover {
                    background: #0056b3;
                    }
                    @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes pop {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <div class="icon">✅</div>
                    <h1>Cuenta Verificada Correctamente</h1>
                    <p>¡Felicitaciones, <strong>${decoded.Email}</strong>!<br>
                    Tu cuenta ha sido activada exitosamente. Ya podés iniciar sesión y disfrutar de todas las funciones.</p>
                    <a href="http://localhost:3000/login">Ir al Inicio de Sesión</a>
                </div>
                </body>
                </html>
            `);
        })
    }
    catch (Error) {

    }
})

module.exports = Rutas;