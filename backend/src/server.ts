import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { ensureDefaultAdmin } from "./utils/seedAdmin";
import { ensureDefaultReporter } from "./utils/seedReporter";
import { initSchedulers } from "./services/newsScheduler.service";

const startServer = async (): Promise<void> => {
  await connectDB();
  await ensureDefaultAdmin();
  await ensureDefaultReporter();
  await initSchedulers();

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
