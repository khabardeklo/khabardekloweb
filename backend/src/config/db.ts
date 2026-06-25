import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async (): Promise<void> => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  // Some networks block SRV DNS lookups from Node's resolver; allow explicit DNS servers.
  if (env.mongoDnsServers) {
    const servers = env.mongoDnsServers
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean);

    if (servers.length > 0) {
      dns.setServers(servers);
    }
  }

  try {
    await mongoose.connect(env.mongoUri);
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ECONNREFUSED" &&
      (error as NodeJS.ErrnoException).syscall === "querySrv"
    ) {
      throw new Error(
        "MongoDB SRV DNS lookup failed. Set MONGO_DNS_SERVERS=8.8.8.8,1.1.1.1 in .env and retry."
      );
    }

    throw error;
  }

  console.log("MongoDB connected");
};
