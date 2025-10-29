import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  host: process.env.HOST || "localhost",
  databaseUrl: process.env.DATABASE_URL,
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
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
  },
  sendEmail: {
    brevo_user: process.env.BREVO_USER,
    brevo_pass: process.env.BREVO_PASS,
    brevo_email: process.env.BREVO_EMAIL,
  },
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
  url: {
    backend: process.env.BACKEND_URL || "http://localhost:5000",
    frontend: process.env.FRONTEND_URL || "http://localhost:3000",
    image: process.env.IMAGE_URL,
    file: process.env.FILE_URL,
  },
};
