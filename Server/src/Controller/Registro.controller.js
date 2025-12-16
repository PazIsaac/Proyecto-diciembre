const { db } = require('../config/database')
const Encriptar = require('bcryptjs')


const RegistrarNuevoUsuario = async (req, res) => {
    const { Nombre, Email, Contraseña } = req.body
    console.log(req.body)
    if (!Nombre || !Email || !Contraseña) {
        console.error('Revisar Datos Vacios ⛔')
        return res.status(401).json({ Error: 'Datos Vacios' })
    }
    try {
        const hash = Encriptar.hashSync(Contraseña, 10)
        query = `INSERT INTO usuarios(nombre,email,contraseña,rol,verificado)VALUES(?,?,?,?,?)`
        db.run(query, [Nombre, Email, hash,'cliente',1], async (Error) => {
            if (Error) {
                console.error('Revisar query ⛔', Error.message)
                return res.status(400).json({ Error: 'El Usuario ya Existe!' })
            }
            res.json({
                message: 'Usuario Registrado Exitosamente ✅'
            })
        })

    }
    catch (Error) {

    }
}

module.exports={RegistrarNuevoUsuario}