const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

async function sendMail(to, subject, text, attachments=[]) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
    attachments,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
