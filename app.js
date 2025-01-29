import express from 'express';
import cors from 'cors'    
import router from './src/routes/admin.js';
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data (if needed)
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // If using cookies or authentication headers
}));
// Use your routes
app.use('/api', router);


const port = 3000;
const hostname = 'localhost';
app.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});
