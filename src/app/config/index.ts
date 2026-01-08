import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  host: process.env.HOST || "localhost",
  databaseUrl: process.env.DATABASE_URL,
  client_url: process.env.FRONTEND_URL!,
  backend_url: process.env.BACKEND_URL!,
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "30d",
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "5y",
    },
  },

  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL!,
    password: process.env.SUPER_ADMIN_PASSWORD,
  },

  smtp: {
    brevo_user: process.env.BREVO_USER,
    brevo_pass: process.env.BREVO_PASS,
    brevo_email: process.env.BREVO_EMAIL,
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    from_name: process.env.SMTP_NAME,
  },

  otp_expiry_minutes: Number(process.env.OTP_EXPIRY_MINUTES) || 10,

  url: {
    backend: process.env.BACKEND_URL || "http://localhost:5000",
    frontend: process.env.FRONTEND_URL || "http://localhost:3000",
    image: process.env.IMAGE_URL,
    file: process.env.FILE_URL,
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
};
