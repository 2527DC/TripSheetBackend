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
