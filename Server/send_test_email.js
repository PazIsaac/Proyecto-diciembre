const nodemailer = require('nodemailer');
require('dotenv').config();

async function main() {
    const recipient = process.env.TEST_RECEIVER || process.env.EMAIL_USER || 'test@example.com';

    const emailUser = process.env.EMAIL_USER || '';
    const emailPass = process.env.EMAIL_PASS || '';

    // Usar Ethereal si no hay credenciales reales
    const useEthereal = !emailUser || !emailPass || /tu_app_password|password|changeme|1234/i.test(emailPass);

    let transporter;

    if (useEthereal) {
        console.log('ℹ️ No hay credenciales válidas en .env — usando cuenta de prueba Ethereal');
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    } else {
        console.log(`ℹ️ Usando credenciales de .env: ${emailUser}`);
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: emailUser, pass: emailPass }
        });
    }

    const info = await transporter.sendMail({
        from: emailUser || 'Test <no-reply@example.com>',
        to: recipient,
        subject: 'Correo de prueba - Proyecto Veterinaria',
        text: 'Este es un correo de prueba enviado desde el proyecto.',
        html: '<p>Este es un <b>correo de prueba</b> enviado desde el proyecto.</p>'
    });

    console.log('✅ Mensaje enviado.');
    if (useEthereal) {
        console.log('🔗 Previsualiza el correo (Ethereal):', nodemailer.getTestMessageUrl(info));
    } else {
        console.log('Info:', info.response || info.messageId || info);
    }
}

main().catch(err => {
    console.error('❌ Error enviando correo de prueba:', err);
    process.exit(1);
});
