import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES module 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = "/var/www/TripSheetBackend";
const logFile = path.join(logDir, "deploy.log");

// Ensure the directory exists before writing
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Ensure the file exists before writing
if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "", "utf8");
}

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage, "utf8");
  console.log(message);
}

try {
  log("🚀 Starting deployment...");

  // Navigate to project directory
  execSync("cd /var/www/TripSheetBackend", { stdio: "inherit" });

  // Fetch latest code
  log("📥 Pulling latest code from Git...");
  execSync("git fetch --all && git reset --hard origin/main && git pull origin main", { stdio: "inherit" });

  // Install dependencies
  log("📦 Installing dependencies...");
  execSync("npm install", { stdio: "inherit" });

  // Check if Prisma migrations have been applied
  log("🛠️ Checking and applying Prisma migrations...");
  try {
    execSync(`DATABASE_URL="postgresql://chethan:chethan%40123@localhost:5432/tripsheet" npx prisma migrate deploy`, { stdio: "inherit" });
  } catch (migrationError) {
    log("⚠️ Migration failed, attempting baseline...");
    execSync(`DATABASE_URL="postgresql://chethan:chethan%40123@localhost:5432/tripsheet" npx prisma migrate resolve --applied "20250328070337_alterd_datatye_tripsheet"`, { stdio: "inherit" });
    execSync(`DATABASE_URL="postgresql://chethan:chethan%40123@localhost:5432/tripsheet" npx prisma db push`, { stdio: "inherit" });
  }

  // Generate Prisma client
  log("⚙️ Generating Prisma Client...");
  execSync("npx prisma generate", { stdio: "inherit" });

  // Restart application with PM2
  log("🔄 Restarting PM2 process...");
  execSync("pm2 restart myapp && pm2 save", { stdio: "inherit" });

  log("✅ Deployment completed successfully!");
} catch (error) {
  log("❌ Deployment failed: " + error.message);
  process.exit(1);
}
