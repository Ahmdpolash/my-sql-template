import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, otp: number) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: config.sendEmail.brevo_user,
      pass: config.sendEmail.brevo_pass,
    },
  });

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f7f9fc; padding: 30px 0; color: #333333;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e0e0e0;">

      <table style="width: 100%; padding: 20px;">
        <tr>
          <td style="text-align: left;">
            <img src="https://cdn.pixabay.com/photo/2022/08/22/02/05/logo-7402513_640.png" alt="Test Project" style="height: 32px; margin-left: 10px; display: block;" />
          </td>
          <td style="text-align: right; color: #9e9e9e; font-size: 12px; margin-right:10px">${formattedDate}</td>
        </tr>
      </table>

      <div style="padding: 0 30px 30px 30px; text-align: center;">

        <h1 style="color: #1a73e8; font-size: 24px; margin-top: 20px; margin-bottom: 20px;">
         OTP Verification
        </h1>

        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Use the following code to complete your verification process.
        </p>

        <div style="background-color: #e8f0fe; padding: 25px; border-radius: 8px; margin-bottom: 30px; border: 1px dashed #a3c3f9;">
          <p style="font-size: 18px; color: #000; margin: 0;">
            Your OTP is:
          </p>
          <p style="font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #1a73e8; margin: 10px 0 5px 0;">
            ${otp}
          </p>
        </div>

        <p style="font-size: 14px; color: #e53935; font-weight: bold; margin-bottom: 30px;">
          This code will expire in 5 minutes.
        </p>

        <p style="font-size: 14px; line-height: 1.5; color: #757575; border-top: 1px solid #eeeeee; padding-top: 20px;">
          **Security Tip:** Do not share this code with anyone. If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    </div>
  </div>
  `;

  await transporter.sendMail({
    from: `"Test Project" <${config.sendEmail.brevo_email}>`,
    to,
    subject: "Email Verification",
    text: `Your OTP code is: ${otp}`,
    html: html,
  });
};
