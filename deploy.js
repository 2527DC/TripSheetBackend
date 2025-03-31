const { execSync } = require("child_process");
const fs = require("fs");

const logFile = "/var/www/TripSheetBackend/deploy.log";

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
  execSync("git fetch --all && git reset --hard origin/main && git pull origin main 2>&1 | tee -a " + logFile, { stdio: "inherit" });

  // Install dependencies
  log("📦 Installing dependencies...");
  execSync("npm install 2>&1 | tee -a " + logFile, { stdio: "inherit" });

  // Run Prisma commands
  log("🛠️ Running Prisma migrations...");
  execSync(`export DATABASE_URL="${process.env.DATABASE_URL_MIGRATION}" && npx prisma migrate deploy 2>&1 | tee -a ` + logFile, { stdio: "inherit" });
  execSync("npx prisma db pull 2>&1 | tee -a " + logFile, { stdio: "inherit" });
  execSync("npx prisma generate 2>&1 | tee -a " + logFile, { stdio: "inherit" });

  // Restart application with PM2
  log("🔄 Restarting PM2 process...");
  execSync("pm2 restart myapp && pm2 save 2>&1 | tee -a " + logFile, { stdio: "inherit" });

  log("✅ Deployment completed successfully!");
} catch (error) {
  log("❌ Deployment failed: " + error.message);
  process.exit(1);
}
