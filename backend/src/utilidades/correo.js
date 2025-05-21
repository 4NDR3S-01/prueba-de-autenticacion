const nodemailer = require('nodemailer');

const transportador = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USUARIO,
    pass: process.env.EMAIL_CONTRASENA
  }
});

module.exports = async (destinatario, asunto, texto) => {
  await transportador.sendMail({
    from: process.env.EMAIL_USUARIO,
    to: destinatario,
    subject: asunto,
    text: texto
  });
};
