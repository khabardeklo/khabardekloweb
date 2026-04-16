import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { env } from "../config/env";

export const ensureDefaultReporter = async (): Promise<void> => {
  const email = env.defaultReporterEmail.toLowerCase();
  const existingReporter = await User.findOne({ email });
  const hashedPassword = await bcrypt.hash(env.defaultReporterPassword, 10);

  if (existingReporter) {
    existingReporter.name = env.defaultReporterName;
    existingReporter.role = "reporter";
    existingReporter.approvalStatus = "active";
    existingReporter.reviewedAt = null;
    existingReporter.password = hashedPassword;
    await existingReporter.save();
    console.log(`Default reporter refreshed: ${env.defaultReporterEmail}`);
    return;
  }

  await User.create({
    name: env.defaultReporterName,
    email,
    password: hashedPassword,
    role: "reporter",
    approvalStatus: "active",
  });

  console.log(`Default reporter created: ${env.defaultReporterEmail}`);
};
