import app from "./app";
import { Server } from "http";
import config from "./app/config";
import { seedSuperAdmin } from "./seedSuperAdmin";

let server: Server;

const main = async () => {
  try {
    // Start server immediately - bind to host for Cloud Run
    server = app.listen(config.port, () => {
      console.log(
        `🚀 App is listening on: http://${config.host}:${config.port}`
      );
    });

    // Seed Super Admin asynchronously (non-blocking)
    seedSuperAdmin().catch((err: any) => {
      console.error("⚠️ Error seeding super admin:", err);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1);
  }
};

main();

// Graceful shutdown handling
const shutdown = () => {
  console.log("🛑 Shutting down servers...");

  if (server) {
    server.close(() => {
      console.log("Servers closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("unhandledRejection", () => {
  console.log(`❌ unhandledRejection is detected, shutting down...`);
  shutdown();
});

process.on("uncaughtException", () => {
  console.log(`❌ uncaughtException is detected, shutting down...`);
  shutdown();
});
