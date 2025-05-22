const nodemailer = require('nodemailer');
const transportador = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USUARIO,
        pass: process.env.EMAIL_CONTRASENA
    }
});

async function enviarCorreo(destinatario, asunto, mensaje) {
  await transportador.sendMail({
    from: process.env.EMAIL_USUARIO,
    to: destinatario,
    subject: asunto,
    text: mensaje
  });
}

module.exports = enviarCorreo;
