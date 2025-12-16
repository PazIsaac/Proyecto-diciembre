const nodemailer = require('nodemailer')
require('dotenv').config();

// ---> Configuración del servicio de correo
const DatosEmail = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// ---> Función para enviar correo de verificación
async function EnviarCorreo(Nombre, Email, TokenEmail) {
    // ---> Configuración del correo
    const hipervinculo_validacion = `http://localhost:3000/api/verificacion/${TokenEmail}`;
    // ---> Opciones del correo
    const opciones = {
        from: process.env.EMAIL_USER,
        to: Email,
        subject: "Confirmar Tu Cuenta Creada 😊",
        // ---> Cuerpo del correo
        html: `
      <div style="
        font-family: Arial, sans-serif;
        background-color: #f6f9fc;
        padding: 40px 0;
        color: #333;
      ">
        <div style="
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
        ">
          <div style="background-color: #007bff; color: white; padding: 20px 30px;">
            <h2 style="margin: 0;">¡Bienvenido a GAREIS S.A ! 🎉</h2>
          </div>

          <div style="padding: 30px;">
            <p style="font-size: 16px;">Hola <strong>${Nombre}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6;">
              Gracias por registrarte en <strong>GAREIS S.A </strong>.  
              Para activar tu cuenta y comenzar a disfrutar de todas las funcionalidades, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:
            </p>

            <div style="text-align: center; margin: 35px 0;">
              <a href="${hipervinculo_validacion}" target="_blank" style="
                background-color: #007bff;
                color: white;
                text-decoration: none;
                padding: 14px 30px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 16px;
                display: inline-block;
              ">
                Verificar mi cuenta ✔
              </a>
            </div>

            <p style="font-size: 14px; color: #555;">
              Si el botón no funciona, también puedes copiar y pegar este enlace en tu navegador:
            </p>

            <p style="
              font-size: 13px;
              color: #007bff;
              word-break: break-all;
            ">
              ${hipervinculo_validacion}
            </p>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

            <p style="font-size: 13px; color: #777;">
              Este correo fue enviado automáticamente. Por favor, no respondas a este mensaje.
              <br><br>
              Si no realizaste este registro, podés ignorar este correo de forma segura.
            </p>
          </div>

          <div style="background-color: #f0f0f0; text-align: center; padding: 15px; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} Gareis S.A. Todos los derechos reservados.
          </div>
        </div>
      </div>
    `,
    };
    // ---> Enviar el correo
    await DatosEmail.sendMail(opciones)
}

module.exports = { EnviarCorreo }