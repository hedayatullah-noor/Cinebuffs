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
    subject: '🔒 Reset Your Password - CineBuffs',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 2px solid #000; background-color: #ffffff;">
        <div style="background-color: #000; padding: 40px 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 32px; letter-spacing: 2px; text-transform: uppercase;">Cine<span style="color: #e11d48;">Buffs</span></h1>
          <p style="color: #888; margin-top: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">Cinematic Reviews & Insights</p>
        </div>
        
        <div style="padding: 40px 30px; line-height: 1.6; color: #333;">
          <h2 style="color: #000; font-size: 22px; margin-top: 0; text-transform: uppercase; font-weight: 900;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>Humein aapke account ke liye password reset ki request mili hai. Agar aapne ye request ki hai, toh niche diye gaye button par click karke apna naya password set karein:</p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 18px 35px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border: 2px solid #000; transition: all 0.3s ease; display: inline-block;">Reset Password</a>
          </div>
          
          <p style="font-size: 13px; color: #666;"><strong>Note:</strong> Yeh link sirf 1 ghante ke liye valid hai. Agar aapne ye request nahi ki hai, toh is email ko ignore karein, aapka password safe rahega.</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="font-size: 11px; color: #999; margin: 0; text-transform: uppercase; letter-spacing: 1px;">© ${new Date().getFullYear()} CineBuffs.org. All Rights Reserved.</p>
          <div style="margin-top: 10px;">
            <a href="https://cinebuffs.org" style="color: #000; text-decoration: none; font-size: 11px; font-weight: bold;">WEBSITE</a>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
