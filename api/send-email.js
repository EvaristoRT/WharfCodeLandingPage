import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // 1. Permitir solo peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

  // 2. Extraer datos enviados desde el formulario
    const { nombre, email, proyecto, descripcion } = req.body;

  // Validar campos obligatorios en el servidor
    if (!nombre || !email || !proyecto) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

  // 3. Configurar el transporte con Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
      // 4. Enviar el correo
        await transporter.sendMail({
            from: `"${nombre}" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Te llega a tu propio correo
            subject: `Nuevo mensaje de proyecto: ${proyecto}`,
            html: `
                Nuevo mensaje de contacto
                Nombre: ${nombre}
                Correo: ${email}
                Tipo de Proyecto: ${proyecto}
                Descripción: ${descripcion || 'Sin descripción'}
            `,
        });

        return res.status(200).json({ message: 'Correo enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar correo:', error);
        return res.status(500).json({ error: 'Error al procesar el correo' });
    }
}