import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set the directory where signatures will be stored
const signaturesDir = path.resolve(__dirname, '..', 'signatures'); // Ensures it's saved in project root

// Ensure the 'signatures' directory exists
if (!fs.existsSync(signaturesDir)) {
  fs.mkdirSync(signaturesDir, { recursive: true });
  console.log(`✅ Created directory: ${signaturesDir}`);
}

// Function to save base64 signature image
export const saveSignatureImage = (base64Data, signatureType) => {
  try {
    // Validate base64 format (PNG or JPEG)
    const matches = base64Data.match(/^data:image\/(png|jpeg);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      console.error("❌ Invalid Base64 format");
      return null;
    }

    // Decode Base64
    const buffer = Buffer.from(matches[2], 'base64');

    // Generate unique filename
    const uniqueFileName = `${signatureType}-${uuidv4()}.png`;
    const filePath = path.join(signaturesDir, uniqueFileName);

    // Write the file
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Signature saved at: ${filePath}`);

    return uniqueFileName;
  } catch (error) {
    console.error("❌ Error saving signature:", error);
    return null;
  }
};
