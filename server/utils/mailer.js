const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,       // your Gmail
    pass: process.env.MAIL_APP_PASS,   // App Password (not your real password)
  },
});

const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"BAZAAR" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Your BAZAAR Login OTP',
    html: `
      <div style="font-family:sans-serif; max-width:400px;">
        <h2 style="color:#D4AF37;">BAZAAR Marketplace</h2>
        <p>Your one-time login code is:</p>
        <h1 style="letter-spacing:8px; color:#D4AF37;">${otp}</h1>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p style="color:#999; font-size:12px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };