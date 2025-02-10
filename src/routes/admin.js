import express from 'express'
import { addTripSheet, getFormdata, login, } from '../controller/UserController.js';

import { createCompany, createDriver,  createUser,  createVendor,  generatelink, getCompanys, getdata, getImage,
     getVendors, updateTripStatus, validateGenerateLink, validateUser } from '../controller/adminController.js';




const router = express.Router();


// Admin routes 

router.post("/createUser",validateUser,createUser) // create  admin users 
router.post("/createCompany",createCompany) // create company
router.get('/get-signature/:imageName',getImage) // get image api to check 
router.post('/login',login)// login 
router.get('/getVendors',getVendors) // get  vendorList
router.post("/createDriver",createDriver)// create Driver 
router.post("/createVendor",createVendor)// create vendor 
router.post("/generate-link", validateGenerateLink, generatelink);//  creating tripsheet 
router.get("/form/:formId", getFormdata); // get the form details to driver 
router.patch("/updateStatus",updateTripStatus)// update the tripsheet status (aprov ,reject )
router.get("/getCompany",getCompanys)


// Driver API
router.get("/gettrips", getdata); // get the trips list 
router.patch('/addtripsheet', addTripSheet) //  Driver updating the tripss 


//  checking api 
router.get('/get-signature/:imageName',getImage) // get image api to check 
router.get('/message', (req,res)=>{
    res.send(" Hi man sucessfull made te changes and applied cicd V7 ")
});
export default router;