import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,       // your Gmail
    pass: process.env.MAIL_APP_PASS,   // App Password (not your real password)
  },
});

export const sendOtpEmail = async (to, otp) => {
  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_APP_PASS) {
      console.warn('Email credentials not configured. OTP would be:', otp);
      return;
    }

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
  } catch (error) {
    console.error('Failed to send OTP email:', error.message);
    // Don't throw — OTP is still saved in DB and user can retry
  }
};

