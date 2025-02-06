import express from 'express'
import { addTripSheet, getFormdata, login, updateTripStatusController } from '../controller/UserController.js';
import { tripShett, UpdateStatus } from '../services/UserService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createDriver,  createVendor,  generatelink, getdata, getImage, getVendors, updateTripStatus } from '../controller/adminController.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the signatures directory
const signaturesDir = path.resolve(__dirname, '..', 'signatures');

const router = express.Router();

router.get('/message', (req,res)=>{
    res.send(" Hi man sucessfull made te changes and applied cicd V7 ")
});
router.get('/get-signature/:imageName',getImage)
router.post('/login',login)
router.get('/trips',tripShett)
router.get('/getVendors',getVendors)
// router.post('/updatestatus',updateTripStatusController)
router.patch('/addtripsheet', addTripSheet)
router.post("/createDriver",createDriver)
router.post("/createVendor",createVendor)
router.patch("/tripsheets/:id/status",UpdateStatus)
router.post("/generate-link",generatelink)
router.get("/form/:formId", getFormdata);

router.get("/gettrips", getdata);
router.patch("/updateStatus",updateTripStatus)

export default router;