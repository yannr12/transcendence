const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.TWOFA_MAIL,
    pass: process.env.TWOFA_PASS,
  },
});

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  const mailOptions = {
    from: process.env.TWOFA_MAIL,
    to: email,
    subject: "Two-Factor Authentication Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #112550;">ft_transcendence - Verification Code</h2>
        <p>Your two-factor authentication code is:</p>
        <div style="font-size: 32px; font-weight: bold; color: #112550; text-align: center; padding: 20px; background-color: #f0f0f0; border-radius: 8px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
}