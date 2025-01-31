// import express from 'express';
// import cors from 'cors';
// import { PrismaClient } from '@prisma/client';
// import bodyParser from 'body-parser'; // Import bodyParser for handling JSON data
// import fs from 'fs';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs

// const app = express();
// const prisma = new PrismaClient();

// // Middleware to parse incoming JSON requests
// app.use(express.json());

// // Middleware to parse URL-encoded data (if needed)
// app.use(express.urlencoded({ extended: true }));

// // Enable CORS for your frontend (for example, on http://localhost:5173)
// app.use(cors({
//   origin: 'http://localhost:5173', 
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true, // Allow cookies if using authentication
// }));

// // Ensure that the 'signatures' directory exists, or create it
// const signaturesDir = path.join(__dirname, 'signatures');
// if (!fs.existsSync(signaturesDir)) {
//   fs.mkdirSync(signaturesDir, { recursive: true });
// }

// // Function to save a base64 signature image
// const saveSignatureImage = (base64Data, signatureType) => {
//   const matches = base64Data.match(/^data:image\/(png|jpeg);base64,(.+)$/);
//   if (matches && matches.length === 3) {
//     const buffer = Buffer.from(matches[2], 'base64');
    
//     // Generate a unique file name using UUID
//     const uniqueFileName = `${signatureType}-${uuidv4()}.png`;
//     const filePath = path.join(signaturesDir, uniqueFileName);
    
//     // Write the buffer to the file
//     fs.writeFileSync(filePath, buffer);
//     console.log(`Signature saved at ${filePath}`);
    
//     return uniqueFileName; // Return the file name to store in the database or respond with
//   }
//   return null;
// };

// // Test the database connection
// const testDatabaseConnection = async () => {
//   try {
//     // Attempt to connect to the database
//     await prisma.$connect();
//     console.log('Database connection established successfully.');
//   } catch (error) {
//     console.error('Failed to connect to the database:', error);
//   }
// };

// // Call the test function
// testDatabaseConnection();

// // Route to handle saving signatures
// app.post('/api/save-signature', async (req, res) => {
//   const { Driversignature, Guestsignature } = req.body;

//   // Save signatures and generate unique file names
//   const driverSignatureFileName = Driversignature ? saveSignatureImage(Driversignature, 'driver') : null;
//   const guestSignatureFileName = Guestsignature ? saveSignatureImage(Guestsignature, 'guest') : null;

//   // Store the file names in the database if needed (using Prisma for example)
//   try {
//     const signatureData = await prisma.signature.create({
//       data: {
//         driverSignature: driverSignatureFileName,
//         guestSignature: guestSignatureFileName,
//       },
//     });
//     res.json({
//       message: 'Signatures saved successfully!',
//       driverSignatureFile: driverSignatureFileName,
//       guestSignatureFile: guestSignatureFileName,
//       signatureData, // Send the saved data in the response
//     });
//   } catch (error) {
//     console.error('Error saving signature data to database:', error);
//     res.status(500).json({ message: 'Error saving signatures', error });
//   }
// });

// // Your existing routes
// import router from './src/routes/admin.js';
// app.use('/api', router);

// const port = 3000;
// const hostname = '0.0.0.0'; // Allow connections from all network interfaces
// app.listen(port, hostname, () => {
//   console.log(`Server is running on http://${hostname}:${port}`);
// });
