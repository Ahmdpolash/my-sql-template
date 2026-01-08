import nodemailer from "nodemailer";
import config from "../config";
import logger from "./logger";

interface IEmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

interface IEmailTemplate {
  title: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
  additionalInfo?: string;
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure, // false for 587, true for 465
  auth: {
    user: config.smtp.brevo_user,
    pass: config.smtp.brevo_pass,
  },
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    logger.error("SMTP connection failed:", error);
  } else {
    logger.info("SMTP server is ready to send emails");
  }
});

/**
 * Core email sending function using Nodemailer with SMTP
 */
const sendEmail = async (options: IEmailOptions): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"${config.smtp.from_name}" <${config.smtp.brevo_email}>`,
      to: options.to,
      subject: options.subject,
      html: options.htmlContent,
      text: options.textContent,
    });

    logger.info(`Email sent successfully to ${options.to}`, {
      messageId: info.messageId,
      subject: options.subject,
    });
  } catch (error: any) {
    logger.error("Failed to send email via SMTP:", {
      to: options.to,
      subject: options.subject,
      message: error.message,
      code: error.code,
    });

    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

/**
 * Generate base email template with modern, responsive design
 */
const generateBaseTemplate = (content: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Email from ${config.smtp.from_name}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f7fa;
            padding: 20px;
          }
          
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          }
          
          .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
          }
          
          .email-header h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
          }
          
          .email-body {
            padding: 40px 30px;
          }
          
          .email-footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          
          .email-footer p {
            font-size: 13px;
            color: #6c757d;
            margin: 8px 0;
          }
          
          .email-footer a {
            color: #667eea;
            text-decoration: none;
          }
          
          .social-links {
            margin-top: 20px;
          }
          
          .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #6c757d;
            text-decoration: none;
            font-size: 14px;
          }
          
          /* Responsive */
          @media only screen and (max-width: 600px) {
            body {
              padding: 10px;
            }
            
            .email-header {
              padding: 30px 20px;
            }
            
            .email-header h1 {
              font-size: 24px;
            }
            
            .email-body {
              padding: 30px 20px;
            }
            
            .email-footer {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          ${content}

        </div>
      </body>
    </html>
  `;
};

/**
 * Generate custom email template with flexible content
 */
const generateCustomTemplate = (template: IEmailTemplate): string => {
  const buttonHtml =
    template.buttonText && template.buttonUrl
      ? `
      <div style="text-align: center; margin: 40px 0 32px;">
        <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <a href="${template.buttonUrl}" 
                 style="display: inline-block; 
                        padding: 16px 36px; 
                        color: #ffffff; 
                        text-decoration: none; 
                        font-weight: 600;
                        font-size: 16px;
                        line-height: 1.5;
                        border-radius: 8px;
                        mso-padding-alt: 0;">
                ${template.buttonText}
              </a>
            </td>
          </tr>
        </table>
        <p style="margin-top: 12px; color: #6B7280; font-size: 13px; text-align: center;">
          Having trouble clicking? Copy and paste this URL into your browser:<br>
          <span style="color: #667eea; word-break: break-all; font-size: 12px;">${template.buttonUrl}</span>
        </p>
      </div>
    `
      : "";

  const additionalInfoHtml = template.additionalInfo
    ? `
      <div style="background-color: #F9FAFB; 
                  padding: 24px; 
                  border-radius: 8px;
                  border: 1px solid #E5E7EB;
                  margin: 32px 0;">
        <div style="display: flex; align-items: flex-start;">
          <div style="flex-shrink: 0; margin-right: 12px;">
            <div style="width: 20px; height: 20px; background-color: #667eea; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 12px;">ℹ️</span>
            </div>
          </div>
          <div>
            <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
              ${template.additionalInfo}
            </p>
          </div>
        </div>
      </div>
    `
    : "";

  const content = `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <!-- Header Section -->
      <div style="text-align: center; padding: 40px 24px 32px;">
        <div style="font-size: 28px; font-weight: 600; color: #111827; margin-bottom: 12px; line-height: 1.3;">
          ${template.title}
        </div>
        <div style="height: 3px; width: 80px; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); margin: 0 auto;"></div>
      </div>

      <!-- Main Content -->
      <div style="padding: 0 24px 40px;">
        <!-- Message Content -->
        <div style="background-color: #FFFFFF;
                    border: 1px solid #F3F4F6;
                    border-radius: 8px;
                    padding: 32px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
          <p style="font-size: 16px; color: #4B5563; line-height: 1.7; margin: 0 0 24px;">
            ${template.message}
          </p>
          
          ${buttonHtml}
          ${additionalInfoHtml}

          <!-- Divider -->
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
            <p style="margin: 0; color: #6B7280; font-size: 14px; text-align: center;">
              Need assistance? Contact our support team for help.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
          <div style="text-align: center;">
            <p style="margin: 0 0 12px; color: #9CA3AF; font-size: 12px;">
              You received this email because you're registered with our service.
            </p>
            <p style="margin: 0; color: #6B7280; font-size: 12px;">
              This is an automated message. Please do not reply directly to this email.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  return generateBaseTemplate(content);
};

/**
 * Generate OTP email template
 */
const generateOTPTemplate = (otp: string, type: string): string => {
  const subjects: Record<string, string> = {
    SIGNUP: "Verify Your Account",
    LOGIN: "Login Verification Code",
    FORGOT_PASSWORD: "Reset Your Password",
    CHANGE_PASSWORD: "Change Password Verification",
  };

  const messages: Record<string, string> = {
    SIGNUP:
      "Thank you for signing up! Please verify your email address to complete your registration.",
    LOGIN:
      "We received a login request for your account. Please use the code below to continue.",
    FORGOT_PASSWORD:
      "You've requested to reset your password. Use the verification code below to proceed.",
    CHANGE_PASSWORD:
      "You've requested to change your password. Please verify this action using the code below.",
  };

  const warnings: Record<string, string> = {
    SIGNUP: "If you didn't create an account, please ignore this email.",
    LOGIN:
      "If you didn't attempt to log in, please secure your account immediately.",
    FORGOT_PASSWORD:
      "If you didn't request a password reset, please ignore this email and ensure your account is secure.",
    CHANGE_PASSWORD:
      "If you didn't request a password change, please contact support immediately.",
  };

  const content = `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <!-- Header -->
      <div style="text-align: center; padding: 32px 24px 24px;">
        <div style="font-size: 28px; font-weight: 600; color: #111827; margin-bottom: 8px;">
          ${subjects[type] || "Verification Code"}
        </div>
        <div style="height: 3px; width: 60px; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); margin: 0 auto;"></div>
      </div>

      <!-- Main Content -->
      <div style="padding: 0 24px 32px;">
        <!-- Message -->
        <p style="font-size: 16px; color: #4B5563; line-height: 1.6; margin-bottom: 32px;">
          ${messages[type] || "Your verification code is ready."}
        </p>

        <!-- OTP Display -->
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="font-size: 14px; color: #6B7280; margin-bottom: 12px; letter-spacing: 0.5px;">
            VERIFICATION CODE
          </div>
          <div style="display: inline-block; 
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: #FFFFFF;
                      padding: 20px 40px;
                      font-size: 32px;
                      font-weight: 700;
                      letter-spacing: 8px;
                      border-radius: 12px;
                      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.25);
                      font-family: 'SF Mono', Monaco, 'Courier New', monospace;">
            ${otp}
          </div>
        </div>

        <!-- Expiry Notice -->
        <div style="background-color: #F0F9FF; 
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #E0F2FE;
                    margin-bottom: 24px;">
          <div style="display: flex; align-items: flex-start;">
            <div style="flex-shrink: 0; margin-right: 12px;">
              <span style="display: inline-block; width: 20px; height: 20px; background-color: #0891B2; border-radius: 50%; text-align: center; line-height: 20px; color: white; font-size: 12px;">⏱</span>
            </div>
            <div>
              <p style="margin: 0; color: #0C4A6E; font-weight: 600; font-size: 14px;">
                Expires in ${config.otp_expiry_minutes} minutes
              </p>
              <p style="margin: 4px 0 0; color: #0369A1; font-size: 13px; line-height: 1.4;">
                For security reasons, this code will automatically expire.
              </p>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div style="background-color: #FFFFFF;
                    border: 1px solid #E5E7EB;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 32px;">
          <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.5;">
            Enter this code to complete your ${type
              .toLowerCase()
              .replace(/_/g, " ")} process.
          </p>
        </div>

        <!-- Security Warning -->
        <div style="background-color: #FEF2F2;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #DC2626;">
          <div style="display: flex; align-items: flex-start;">
            <div style="flex-shrink: 0; margin-right: 12px;">
              <span style="color: #DC2626; font-size: 16px;">⚠️</span>
            </div>
            <div>
              <p style="margin: 0; color: #7F1D1D; font-weight: 600; font-size: 14px; margin-bottom: 4px;">
                Security Notice
              </p>
              <p style="margin: 0; color: #991B1B; font-size: 13px; line-height: 1.5;">
                ${
                  warnings[type] ||
                  "If you didn't request this code, please ignore this email."
                }
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Note -->
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
          <p style="margin: 0; color: #6B7280; font-size: 12px; text-align: center; line-height: 1.5;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </div>
  `;

  return generateBaseTemplate(content);
};

/**
 * Generate plain text version of OTP email
 */
const generateOTPPlainText = (otp: string, type: string): string => {
  const subjects: Record<string, string> = {
    SIGNUP: "Verify Your Account",
    LOGIN: "Login Verification Code",
    FORGOT_PASSWORD: "Reset Your Password",
    CHANGE_PASSWORD: "Change Password Verification",
  };

  const divider = "=".repeat(50);

  return `
${divider}
${subjects[type] || "Verification Code"}
${divider}

Your verification code: ${otp}

IMPORTANT: This code expires in ${config.otp_expiry_minutes} minutes.

${divider}
SECURITY NOTICE
${divider}

If you didn't request this code, please ignore this email.

---
${config.smtp.from_name}
This is an automated message. Please do not reply.
  `.trim();
};

/**
 * Send OTP email with improved design and error handling
 */
export const sendOTPEmail = async (
  email: string,
  otp: string,
  type: string
): Promise<void> => {
  const subjects: Record<string, string> = {
    SIGNUP: "Verify Your Account",
    LOGIN: "Login Verification Code",
    FORGOT_PASSWORD: "Reset Your Password",
    CHANGE_PASSWORD: "Change Password Verification",
  };

  const htmlContent = generateOTPTemplate(otp, type);
  const textContent = generateOTPPlainText(otp, type);

  await sendEmail({
    to: email,
    subject: subjects[type] || "Verification Code",
    htmlContent,
    // textContent,
  });
};

/**
 * Send welcome email after successful verification
 */
export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const htmlContent = generateCustomTemplate({
    title: "Welcome Aboard! 🎉",
    message: `Hi ${name},<br><br>Welcome to ${config.smtp.from_name}! We're excited to have you on board. Your account has been successfully verified and you're all set to get started.`,
    buttonText: "Get Started",
    buttonUrl: config.client_url,
    additionalInfo:
      "If you have any questions or need assistance, our support team is here to help. Feel free to reach out anytime!",
  });

  await sendEmail({
    to: email,
    subject: `Welcome to ${config.smtp.from_name}!`,
    htmlContent,
  });
};

/**
 * Send password reset confirmation email
 */
export const sendPasswordResetConfirmationEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const htmlContent = generateCustomTemplate({
    title: "Password Reset Successful",
    message: `Hi ${name},<br><br>Your password has been successfully reset. You can now log in to your account using your new password.`,
    buttonText: "Log In",
    buttonUrl: `${config.client_url}/login`,
    additionalInfo:
      "If you didn't make this change or believe an unauthorized person has accessed your account, please contact our support team immediately.",
  });

  await sendEmail({
    to: email,
    subject: "Your Password Has Been Reset",
    htmlContent,
  });
};

/**
 * Send password change notification email
 */
export const sendPasswordChangeNotificationEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const htmlContent = generateCustomTemplate({
    title: "Password Changed",
    message: `Hi ${name},<br><br>This is a confirmation that your account password was successfully changed. If you made this change, no further action is needed.`,
    additionalInfo:
      "⚠️ If you didn't change your password, your account may be compromised. Please contact our support team immediately to secure your account.",
  });

  await sendEmail({
    to: email,
    subject: "Your Password Has Been Changed",
    htmlContent,
  });
};

/**
 * Send account deletion confirmation email
 */
export const sendAccountDeletionEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const htmlContent = generateCustomTemplate({
    title: "Account Deleted",
    message: `Hi ${name},<br><br>We're sorry to see you go. Your account has been successfully deleted from our system. All your data has been removed in accordance with our privacy policy.`,
    additionalInfo:
      "If you deleted your account by mistake, please contact our support team within 30 days to discuss recovery options.",
  });

  await sendEmail({
    to: email,
    subject: "Your Account Has Been Deleted",
    htmlContent,
  });
};

/**
 * Send generic notification email
 */
export const sendNotificationEmail = async (
  email: string,
  subject: string,
  template: IEmailTemplate
): Promise<void> => {
  const htmlContent = generateCustomTemplate(template);

  await sendEmail({
    to: email,
    subject,
    htmlContent,
  });
};

// ==================== CONTACT FORM EMAILS ====================

/**
 * Send contact form notification to super admin
 */
export const sendContactFormNotificationToAdmin = async (
  contact: any
): Promise<void> => {
  const typeLabels: Record<string, string> = {
    GENERAL_FEEDBACK: "General Feedback",
    FEATURE_REQUEST: "Feature Request",
    REPORT_BUG: "Bug Report",
    COMPLIMENT: "Compliment",
  };

  const typeEmojis: Record<string, string> = {
    GENERAL_FEEDBACK: "💬",
    FEATURE_REQUEST: "💡",
    REPORT_BUG: "🐛",
    COMPLIMENT: "🎉",
  };

  const typeColors: Record<string, string> = {
    GENERAL_FEEDBACK: "#6c757d",
    FEATURE_REQUEST: "#0dcaf0",
    REPORT_BUG: "#dc3545",
    COMPLIMENT: "#198754",
  };

  const content = `
    <div class="email-header">
      <h1>${typeEmojis[contact.type]} New ${typeLabels[contact.type]}</h1>
    </div>
    <div class="email-body">
      <div style="background: linear-gradient(135deg, ${
        typeColors[contact.type]
      }15 0%, ${typeColors[contact.type]}05 100%);
                  padding: 25px;
                  border-left: 4px solid ${typeColors[contact.type]};
                  border-radius: 8px;
                  margin-bottom: 30px;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #495057; font-size: 14px;">
          Contact Type
        </p>
        <p style="margin: 0; color: ${
          typeColors[contact.type]
        }; font-size: 18px; font-weight: 700;">
          ${typeLabels[contact.type]}
        </p>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; color: #495057; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">
          Contact Details
        </h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
              <strong style="color: #6c757d; font-size: 14px;">Name:</strong>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; text-align: right;">
              <span style="color: #495057; font-size: 14px;">${
                contact.name
              }</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
              <strong style="color: #6c757d; font-size: 14px;">Email:</strong>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; text-align: right;">
              <a href="mailto:${
                contact.email
              }" style="color: #667eea; font-size: 14px; text-decoration: none;">
                ${contact.email}
              </a>
            </td>
          </tr>
          ${
            contact.user
              ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
              <strong style="color: #6c757d; font-size: 14px;">User ID:</strong>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; text-align: right;">
              <span style="color: #495057; font-size: 14px; font-family: monospace;">${contact.userId}</span>
            </td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
              <strong style="color: #6c757d; font-size: 14px;">Submitted:</strong>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; text-align: right;">
              <span style="color: #495057; font-size: 14px;">${new Date(
                contact.createdAt
              ).toLocaleString()}</span>
            </td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; color: #495057; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">
          Subject
        </h3>
        <p style="margin: 0; color: #495057; font-size: 15px; font-weight: 500;">
          ${contact.subject}
        </p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px 0; color: #495057; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">
          Message
        </h3>
        <div style="background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #e9ecef;">
          <p style="margin: 0; color: #495057; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${
            contact.message
          }</p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 35px;">
        <a href="${config.client_url}/admin/contacts/${contact.id}" 
           style="display: inline-block; 
                  padding: 14px 32px; 
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: #ffffff; 
                  text-decoration: none; 
                  border-radius: 8px; 
                  font-weight: 600;
                  font-size: 16px;
                  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
          View in Admin Panel
        </a>
      </div>
    </div>
  `;

  const htmlContent = generateBaseTemplate(content);

  await sendEmail({
    to: config.superAdmin.email!,
    subject: `${typeEmojis[contact.type]} New ${typeLabels[contact.type]}: ${
      contact.subject
    }`,
    htmlContent,
  });
};

/**
 * Send confirmation email to user who submitted contact form
 */
export const sendContactFormConfirmation = async (
  email: string,
  name: string,
  subject: string
): Promise<void> => {
  const htmlContent = generateCustomTemplate({
    title: "We Received Your Message! 📬",
    message: `Hi ${name},<br><br>Thank you for reaching out to us! We've received your message regarding "<strong>${subject}</strong>" and our team will review it shortly.<br><br>We typically respond within 24-48 hours. If your matter is urgent, please don't hesitate to follow up with us.`,
    additionalInfo:
      "In the meantime, feel free to explore our Help Center or FAQ section for quick answers to common questions.",
  });

  await sendEmail({
    to: email,
    subject: `We Received Your Message - ${config.smtp.from_name}`,
    htmlContent,
  });
};

/**
 * Optional: Send reply to user when admin resolves their contact
 */
export const sendContactReplyEmail = async (
  contact: any,
  adminReply: string
): Promise<void> => {
  const typeLabels: Record<string, string> = {
    GENERAL_FEEDBACK: "General Feedback",
    FEATURE_REQUEST: "Feature Request",
    REPORT_BUG: "Bug Report",
    COMPLIMENT: "Compliment",
  };

  const content = `
    <div class="email-header">
      <h1>Response to Your ${typeLabels[contact.type]}</h1>
    </div>
    <div class="email-body">
      <p style="font-size: 16px; color: #495057; margin-bottom: 20px; line-height: 1.7;">
        Hi ${contact.name},<br><br>
        Thank you for contacting us regarding "<strong>${
          contact.subject
        }</strong>". Our team has reviewed your message and here's our response:
      </p>

      <div style="background-color: #f8f9fa;
                  padding: 25px;
                  border-left: 4px solid #667eea;
                  border-radius: 8px;
                  margin: 25px 0;">
        <p style="margin: 0; color: #495057; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${adminReply}</p>
      </div>

      <p style="font-size: 15px; color: #6c757d; margin-top: 25px; line-height: 1.6;">
        If you have any further questions or concerns, please don't hesitate to reach out to us again.
      </p>

      <div style="background-color: #e8f4f8;
                  padding: 20px;
                  border-left: 4px solid #0891b2;
                  border-radius: 6px;
                  margin-top: 25px;">
        <p style="margin: 0; color: #0c4a6e; font-size: 14px; line-height: 1.6;">
          <strong>Your Original Message:</strong><br>
          "${contact.subject}"
        </p>
      </div>
    </div>
  `;

  const htmlContent = generateBaseTemplate(content);

  await sendEmail({
    to: contact.email,
    subject: `Re: ${contact.subject} - ${config.smtp.from_name}`,
    htmlContent,
  });
};

export default sendEmail;
