const transporter = require('../config/conexion-email')

const enviarEmail = async (destinatario, asunto, contenido) => {

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: destinatario,
        subject: asunto,
        html: contenido
    })
}

module.exports = {enviarEmail}