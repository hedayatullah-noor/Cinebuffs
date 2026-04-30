import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetPasswordEmail = async (email: string, resetUrl: string) => {
  const mailOptions = {
    from: `"CineBuffs Support" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Reset Your Password - CineBuffs',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Aapne apne CineBuffs account ke liye password reset ki request ki hai. Niche diye gaye button par click karke apna password badlein:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px;">Reset Password</a>
        </div>
        <p>Agar aapne ye request nahi ki hai, toh is email ko ignore karein. Yeh link 1 ghante mein expire ho jayega.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
        <p style="font-size: 12px; color: #888;">CineBuffs.org | Cinematic Reviews & Insights</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
