import express from 'express'
import { addTripSheet, deleteAdmin, deleteCustomer, deleteDriver, getCompanyDetails, getFormdata, getVehicleOnly, searchVendor, updateGuestSignature, updateOpenDetails,  } from '../controller/UserController.js';

import { addAdmin, createCategory, createCompany, createDriver,  createUser, 
     createVehicle,  createVendor,fetchAdmins,  fetchApprovedTripsheet,  fetchAssignedTripList,  fetchCategory,  fetchDrivers,  fetchLogs,  fetchPendingTripsheet,  fetchRejectedTripsheet,  fetchUsersONSearchType,  fetchVendors,  generatelink,    getImage,getTripsBySearchQueryAndDate,getTripsByVendorAndDate,
     updateCustomer,
     updateDriver,
     updatePassword,
     updateSignature, updateSingleField, updateTripStatus, validateGenerateLink, validateSignature, validateUser } from '../controller/adminController.js';
import sendWhatsAppMessage, { sendSMS } from '../services/twilioService.js';
import { createCustomer, getCustomerByCompany, login } from '../controller/authController.js';
import { validateDriver, validateLogin } from '../middlewares/authMiddleware.js';
  



const router = express.Router();


// Admin route

router.post("/createUser",validateUser,createUser) // create  admin users 
router.get('/get-signature/:imageName',getImage) // get image api to check 


// Driver API
router.patch('/addtripsheet',validateSignature,addTripSheet) //  Driver updating the tripss 
router.get("/form/:formId", getFormdata); // get the form details to driver 
router.patch("/updateOpenKm",updateOpenDetails)
router.patch("/updateGuestSignature",updateGuestSignature)

//  checking api 
router.get('/get-signature/:imageName',getImage) // get image api to check 

router.get('/message', (req,res)=>{
    res.send(" Hi man sucessfull made te changes and applied cicd V7 ")
});


//  auth api 
router.post('/login',validateLogin,login)// login   


// router.get("/vehicles", getVehicleDetails);
router.get("/companys", getCompanyDetails);
router.get("/vehicle-list",getVehicleOnly)
router.post("/create-vehicle",createVehicle)
router.get("/searchVendor", searchVendor);
router.get("/trips",getTripsBySearchQueryAndDate) // this is the   end point for  getting the trips  list 
router.get("/getCustomers", getCustomerByCompany);
router.post("/createCustomer",createCustomer)
router.post("/create-admin",addAdmin)
router.get("/fetchAdmins",fetchAdmins)
router.post("/generate-link", validateGenerateLink, generatelink);//  creating tripsheet 
router.post("/createCategory",createCategory)
router.get("/fetchCategory",fetchCategory)
router.post("/createVendor",createVendor)// create vendor 
router.post("/createDriver",validateDriver,createDriver)// create Driver 
router.post("/createCompany",createCompany) // create company

router.patch("/editField",updateSingleField)
router.get("/getLogs",fetchLogs)
router.patch("/updateSignature",updateSignature)
router.patch("/updateStatus",updateTripStatus)// update thetripsheet status (aprov ,reject )
router.get("/getVendors",fetchVendors)
router.get("/getDrivers",fetchDrivers)
router.get("/get-pendingTrips",fetchPendingTripsheet)
router.get("/get-approvedTrips",fetchApprovedTripsheet)
router.get("/get-rejectedTrips",fetchRejectedTripsheet)
router.get("/search",fetchUsersONSearchType)
router.delete("/delete-admin/:id",deleteAdmin)
router.delete("/delete-driver",deleteDriver)
router.delete("/delete-customer",deleteCustomer)
router.patch("/edit-customer",updateCustomer)
router.patch("/update-driver",updateDriver)
router.patch("/update-password",updatePassword)// update  password
router.get("/getAssigned",fetchAssignedTripList)



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