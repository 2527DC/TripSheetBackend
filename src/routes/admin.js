import express from 'express'
import { getFormdata, login, TripDetailsController, updateTripStatusController } from '../controller/UserController.js';
import { tripShett, UpdateStatus } from '../services/UserService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createDriver,  createVendor,  generatelink } from '../controller/adminController.js';

// Get the current directory
// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the signatures directory
const signaturesDir = path.resolve(__dirname, '..', 'signatures');

const router = express.Router();

router.get('/message', (req,res)=>{
    res.send("  this is the message form the router  and the cici is completed ")
});

router.post('/login',login)
router.get('/trips',tripShett)
router.post('/updatestatus',updateTripStatusController)
router.post('/addtripsheet',TripDetailsController)
router.post("/createDriver",createDriver)
router.post("/createVendor",createVendor)
router.patch("/tripsheets/:id/status",UpdateStatus)
router.post("/generate-link",generatelink)
router.get("/form/:formId", getFormdata);
export default router;