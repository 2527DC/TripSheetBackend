import express from 'express'
import { addTripSheet, getCompanyDetails, getFormdata, getVehicleDetails, getVehicleOnly, searchVendor,  } from '../controller/UserController.js';

import { addAdmin, createCompany, createDriver,  createUser, 
     createVehicle, 
     createVendor,  cretaeCategory,  fetchAdmins,  generatelink, getCategory,
      getCompanys,  getImage,
     getTripsByVendorAndDate,
     getVendors,  updateSignature,
      updateSingleField, updateTripStatus, validateGenerateLink, validateSignature, validateUser } from '../controller/adminController.js';
import sendWhatsAppMessage, { sendSMS } from '../services/twilioService.js';
import { createCustomer, getCustomerByCompany, login } from '../controller/authController.js';
import { validateDriver, validateLogin } from '../middlewares/authMiddleware.js';
  



const router = express.Router();


// Admin route

router.post("/createUser",validateUser,createUser) // create  admin users 
router.post("/createCompany",createCompany) // create company
router.get('/get-signature/:imageName',getImage) // get image api to check 
router.post('/login',validateLogin,login)// login 
router.get('/getVendors',getVendors) // get  vendorList
router.post("/createDriver",validateDriver,createDriver)// create Driver 
router.post("/createVendor",createVendor)// create vendor 
router.post("/generate-link", validateGenerateLink, generatelink);//  creating tripsheet 

router.patch("/updateStatus",updateTripStatus)// update thetripsheet status (aprov ,reject )
router.get("/getCompanies",getCompanys) // get company list 
router.patch("/editField",updateSingleField)
router.patch("/updateSignature",updateSignature)
router.post("/createCategory",cretaeCategory)
router.get("/getCategory",getCategory)






// Driver API

router.patch('/addtripsheet',validateSignature,addTripSheet) //  Driver updating the tripss 
router.get("/form/:formId", getFormdata); // get the form details to driver 


//  checking api 
router.get('/get-signature/:imageName',getImage) // get image api to check 
router.get('/message', (req,res)=>{
    res.send(" Hi man sucessfull made te changes and applied cicd V7 ")
});




// 🚀 API to search vehicles by number
router.get("/vehicles", getVehicleDetails);
router.get("/companys", getCompanyDetails);
router.get("/vehicle-list",getVehicleOnly)
router.post("/create-vehicle",createVehicle)
router.get("/searchVendor", searchVendor);
router.get("/trips",getTripsByVendorAndDate) // this is the   end point for  getting the trips  list 
router.get("/getCustomers/:companyId", getCustomerByCompany);
router.post("/createCustomer/:companyId",createCustomer)
router.post("/create-admin",addAdmin)
router.get("/fetchAdmins",fetchAdmins)


// / API to send WhatsApp message/
router.post('/send-message', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: 'Phone number and message are required' });
    }

    try {
        const response = await sendWhatsAppMessage(phone, message);
        res.json({ success: true, messageId: response.sid });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});



router.post('/send-sms', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: 'Phone number and message are required' });
    }

    try {
        const response = await sendSMS(phone, message);
        res.json({ success: true, messageId: response.sid });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send SMS' });
    }
});


export default router;