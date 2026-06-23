import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "",
  accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES || "15m",
  refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  adminUrl: process.env.ADMIN_URL || "http://localhost:3001",
  defaultAdminName: process.env.DEFAULT_ADMIN_NAME || "Super Admin",
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || "admin@khabardeklo.com",
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123",
  defaultReporterName: process.env.DEFAULT_REPORTER_NAME || "News Reporter",
  defaultReporterEmail: process.env.DEFAULT_REPORTER_EMAIL || "reporter@khabardeklo.com",
  defaultReporterPassword: process.env.DEFAULT_REPORTER_PASSWORD || "Reporter@123",
  revalidateSecret: process.env.REVALIDATE_SECRET || "revalidate-secret-key",
};
