const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendResetEmail = async (to, token) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset",
    text: `Click here to reset your password: ${resetLink}`
  });
};
