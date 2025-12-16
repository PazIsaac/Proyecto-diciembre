const jwt = require('jsonwebtoken')
require('dotenv').config();

// ---> Sirve para generar un token con el email del usuario <---
function GenerarToken(Email) {
    // ---> El token expira en 1 día <---
    return jwt.sign({ Email }, process.env.JWT_SECRET, { expiresIn: "1d" })
}
// ---> Sirve para verificar el token del email del usuario <---
function VerificacionToken(TokenEmail) {
    // ---> Verifica el token y devuelve el email si es válido <---
    return jwt.verify(TokenEmail,process.env.JWT_SECRET)
}

module.exports = { GenerarToken, VerificacionToken }