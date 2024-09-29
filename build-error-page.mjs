import { copyFile } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Source and destination paths
const src = join(__dirname, "dist", "index.html");
const dest = join(__dirname, "dist", "404.html");

// Copy file function
copyFile(src, dest, (err) => {
  if (err) {
    console.error("Error copying file:", err);
    process.exit(1);
  }
  console.log(`${src} was copied to ${dest}`);
});
