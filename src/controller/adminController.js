import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();
// Generate a unique form link
 export const generatelink= async (req, res) => {
    const formId = uuidv4();
    const { 
      acType, 
      driver, 
      dropAddress, 
      passengerName, 
      passengerPhoneNumber, 
      reportingAddress, 
      vehicle,
      reportingTime 
    } = req.body;
  console.log(" this thre requestbody",req.body);
  
    try {
      const newTripsheet=await prisma.form.create({
        data:{
          formId: formId,
          drivername:driver,
          vehicleNo:vehicle,
          passengerName:passengerName,
          passengerPh:passengerPhoneNumber,
          reportingTime:reportingTime,
          reportingAddress :reportingAddress,
          dropAddress: dropAddress,
          acType :acType    
        
        }
        })
        
        if (newTripsheet) {
          res.status(201).json({
            message:"tripcreated sussfully",
            data:newTripsheet,
          })
          
        }
    } catch (error) {
      res.status(500).json({
        message:" something went wrong "
        ,error:error
      })
      console.log(" error",error);
      
    }
    
   
  }


  export const createDriver = async (req, res) => {
    const { driverName, vehicleNo, vehicleType, phNumber } = req.body; // Change vehicleNO to vehicleNo

  
    if (!driverName) {
      return res.status(400).json({ message: "driverName is required" });
    } else if (!vehicleNo) {
      return res.status(400).json({ message: "vehicleNo is required" });
    } else if (!vehicleType) {
      return res.status(400).json({ message: "vehicleType is required" });
    } else if (!phNumber) {
      return res.status(400).json({ message: "phNumber is required" });
    }
    
    try {
      const newDriver = await prisma.driver.create({
        data: {
          driverName,
          vehicleNo,  // Match Prisma schema
          vehicleType,
          phoneNo:phNumber,
        },
      });
  
      return res.status(201).json({
        message: "Driver created successfully",
        driver: newDriver,
      });
    } catch (error) {
      if (error.code === 'P2002') { // Unique constraint violation error code
        const failedFields = error.meta.target; // This will contain the violated field(s) as an array
    
        // Log the violated field(s)
        console.log(`Unique constraint failed on fields: ${failedFields.join(', ')}`);
    
        // Send an appropriate response
          res.status(400).json({
          message: ` ${failedFields} aleady exist`,
        });
      } else {
        // Handle other types of errors
        res.status(500).json({ error: error });
      }
    
    }
  };
  
  export const createVendor = async (req, res) => {
    const { vendorName,phoneNo,city } = req.body; // Change vehicleNO to vehicleNo
    try {
      const newVendor = await prisma.vendor.create({
        data: {
          vendorName,
          phoneNo,  // Match Prisma schema
          city 
        },
      });

     
         res.status(201).json({
          message: "Driver created successfully",
          driver: newVendor,
        });
    
    } catch (error) {
      if (error.code === 'P2002') { // Unique constraint violation error code
        const failedFields = error.meta.target; // This will contain the violated field(s) as an array
    
        // Log the violated field(s)
        console.log(`Unique constraint failed on fields: ${failedFields.join(', ')}`);
    
        // Send an appropriate response
          res.status(400).json({
          message: ` ${failedFields} aleady exist`,
        });
      } else {
        // Handle other types of errors
        res.status(500).json({ error: error });
      }
    
      
    }
  };
  