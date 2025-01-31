import express from 'express'
import { login, TripDetailsController, updateTripStatusController } from '../controller/UserController.js';
import { tripShett } from '../services/UserService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory
// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the signatures directory
const signaturesDir = path.resolve(__dirname, '..', 'signatures');

const router = express.Router();

router.get('/message', (req,res)=>{
    res.send("  this is the message form the router ")
});

router.post('/login',login)
router.get('/trips',tripShett)
router.post('/updatestatus',updateTripStatusController)
router.post('/addtripsheet',TripDetailsController)



// router.get('/signature/:filename', (req, res) => {
//     const { filename } = req.params;
//     console.log("Method has been invoked for file:", filename);
  
//     const filePath = path.join(signaturesDir, filename);
//     console.log("Serving file from path:", filePath);
  
//     // Check if the file exists
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ error: "Signature not found" });
//     }
  
//     // Read the file and convert it to a Base64 string
//     fs.readFile(filePath, (err, data) => {
//       if (err) {
//         return res.status(500).json({ error: "Error reading the file" });
//       }
  
//       // Convert binary data to Base64
//       const base64Image = `data:image/png;base64,${data.toString('base64')}`;
      
//       // Send the Base64 string in the response
//       res.json({ image: base64Image });
//     });
//   });
  
export default router;