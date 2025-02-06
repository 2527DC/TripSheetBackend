import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();



// Middleware to parse incoming JSON requests
// Serve the 'signatures' directory as a static folder

app.use(express.json({ limit: '3mb' })); 

// Middleware to parse URL-encoded data (if needed)
app.use(express.urlencoded({ extended: true }));


// Enable CORS for your frontend (for example, on http://localhost:5173)
app.use(cors({
  origin: ['http://localhost:5173', 'https://tripsheet.mltcorporate.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));


// Test the database connection
const testDatabaseConnection = async () => {
  try {
    // Attempt to connect to the database
    await prisma.$connect();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
};

// Call the test function
testDatabaseConnection();



// Your existing routes
import router from './src/routes/admin.js';
app.use('/api', router);

const port = 3000;
const hostname = '0.0.0.0'; // Allow connections from all network interfaces
app.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});

// import express from 'express';
// import cors from 'cors';
// import { PrismaClient } from '@prisma/client';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs'; // Import fs module to check file existence

// const app = express();
// const prisma = new PrismaClient();

// // Enable CORS for your frontend (for example, on http://localhost:5173)
// app.use(cors({
//   origin: 'http://localhost:5173', // Make sure the frontend URL matches
//   methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
//   credentials: true, // Allow cookies if needed
// }));

// // Middleware to parse incoming JSON requests
// app.use(express.json({ limit: '3mb' }));

// // Middleware to parse URL-encoded data (if needed)
// app.use(express.urlencoded({ extended: true }));

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use('/signatures', express.static(path.join(__dirname, 'src', 'signatures')));

// app.get('/get-signature/:imageName', (req, res) => {
//   console.log("method got invoked");

//   const { imageName } = req.params;
//   const imagePath = path.join(__dirname, 'src', 'signatures', imageName);

//   console.log('Computed image path:', imagePath); // Log the full path

//   res.sendFile(imagePath, (err) => {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });
// });


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

// // Your existing routes
// import router from './src/routes/admin.js';
// app.use('/api', router);

// const port = 3000; // Use port 5000 to match your frontend's request
// const hostname = '0.0.0.0'; // Allow connections from all network interfaces
// app.listen(port, hostname, () => {
//   console.log(`Server is running on http://${hostname}:${port}`);
// });

// import express from 'express';
// import cors from 'cors';
// import { PrismaClient } from '@prisma/client';



// const prisma = new PrismaClient();
// const app = express();
// app.use(express.json());
// app.use(cors());




// // Submit Form
// app.post("/api/submit-form/:formId", async (req, res) => {
//   const { editableFields, signature } = req.body;
//   await prisma.form.update({
//     where: { formId: req.params.formId },
//     data: { editableFields, signature, status: "completed" },
//   });
//   res.json({ message: "Form submitted successfully" });
// });

// const port = 3000; // Use port 5000 to match your frontend's request
// const hostname = '0.0.0.0'; // Allow connections from all network interfaces
// app.listen(port, hostname, () => {    
//   console.log(`Server is running on http://${hostname}:${port}`);
// });