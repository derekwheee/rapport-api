const Nodemailer = require('nodemailer');

module.exports = {
    async sendUserInvite(client, name, to, token) {
        // TODO: Use real SMTP server
        const credentials = await Nodemailer.createTestAccount();

        const transporter = Nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: credentials.user, // generated ethereal user
                pass: credentials.pass // generated ethereal password
            }
        });

        const email = await transporter.sendMail({
            // TODO: Use real from address
            from: '"Rapport 👻" <no-reply@example.com>',
            to,
            subject: `${client} has sent you an invitation`,
            text: token,
            // TODO: Don't hardcode the URL ya dingus
            // TODO: Make a nicer looking invite email
            html: `Hello ${name},<br><br><a href="http://localhost:3000/register?token=${token}>Click here to register</a>`
        });

        return email;
    }
};