import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { env } from "../config/env";

export const ensureDefaultAdmin = async (): Promise<void> => {
  const email = env.defaultAdminEmail.toLowerCase();
  const existingAdmin = await User.findOne({ email });
  const hashedPassword = await bcrypt.hash(env.defaultAdminPassword, 10);

  if (existingAdmin) {
    existingAdmin.name = env.defaultAdminName;
    existingAdmin.role = "admin";
    existingAdmin.password = hashedPassword;
    await existingAdmin.save();
    console.log(`Default admin refreshed: ${env.defaultAdminEmail}`);
    return;
  }

  await User.create({
    name: env.defaultAdminName,
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log(`Default admin created: ${env.defaultAdminEmail}`);
};
