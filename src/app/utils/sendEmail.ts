import nodemailer from "nodemailer";
import config from "../config/index.js";

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
  <div style="max-width: 600px; margin: 0 auto; background-color: #F6F7F9; color: #000; border-radius: 8px; padding: 24px;">
    <table style="width: 100%;">
      <tr>
        <td>
          <div style="padding: 5px; text-align: center;">
            <img src="https://res.cloudinary.com/shariful10/image/upload/v1756638997/dca_zm3cpj.png" alt="logo" style="height: 40px; margin-bottom: 16px;" />
          </div>
        </td>
        <td style="text-align: right; color: #999;">${formattedDate}</td>
      </tr>
    </table>

    <h3 style="text-align: center; color: #000;">Your OTP Code</h3>
    <div style="padding: 0 1em;">
      <p style="text-align: center; line-height: 28px; color: #000;">
        <strong style="color: #000; font-size: 24px;">${otp}</strong>
      </p>
      <p style="text-align: center; line-height: 28px; color: #000;">
        This code will expire in 5 minutes.
      </p>
    </div>
  </div>
  `;

  await transporter.sendMail({
    from: `"Dream Canvas Art" <${config.sendEmail.brevo_email}>`,
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
    html: html,
  });
};
