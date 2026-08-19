import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { nombre, empresa, correo, proyecto, descripcion, website_hp } = req.body;

    // 1. HONEYPOT: Si el campo trampa tiene valor, descartamos en silencio
    if (website_hp && website_hp.trim() !== "") {
        return res.status(200).json({ success: true, message: "Mensaje procesado" });
    }

    // 2. VALIDACIONES EN SERVIDOR
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nombre || nombre.trim() === "") {
        return res.status(400).json({ error: "El nombre es obligatorio." });
    }
    if (!correo || !emailRegex.test(correo.trim())) {
        return res.status(400).json({ error: "Ingresa un correo electrónico válido." });
    }
    if (!proyecto || proyecto.trim() === "") {
        return res.status(400).json({ error: "Debes seleccionar un tipo de proyecto." });
    }

    // 3. CONFIGURAR TRANSPORTE DE GMAIL (usando variables de entorno)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `Formulario Web <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO || process.env.EMAIL_USER,
            replyTo: correo,
            subject: `Nuevo mensaje de contacto: ${nombre}`,
            html: `
                <h2>Nuevo mensaje de contacto desde la web</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Empresa:</strong> ${empresa || 'No especificada'}</p>
                <p><strong>Correo del cliente:</strong> ${correo}</p>
                <p><strong>Tipo de Proyecto:</strong> ${proyecto}</p>
                <p><strong>Descripción:</strong> ${descripcion || 'Sin descripción'}</p>
            `,
        });

        return res.status(200).json({ success: true, message: "Mensaje enviado con éxito" });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return res.status(500).json({ error: "Ocurrió un error al procesar el mensaje" });
    }
}