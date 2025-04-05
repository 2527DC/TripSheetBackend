import { saveSignatureImage } from "../services/SaveSIgnatureService.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const addTripSheet = async (req, res) => {
  try {
    const { 
   
       closeKm, closeHr,  totalKm,totalHr,  
      formId, 
      parkingCharges, 
      toolCharges,
      rating, 
      categoryHr,
      categoryKm,
      closeDate
    } = req.body;
    const totalHrInt = parseInt(totalHr.split(":")[0], 10);

    const extraHr=totalHrInt>categoryHr ?totalHrInt-categoryHr:0
    const extraKm=totalKm>categoryKm?totalKm-categoryKm:0

  

    if (totalHr) {
      console.log("Total hours provided:", totalHr);
    } else {
      console.log("Total hours not sent.");
    }

    // ✅ Step 1: Check for missing fields and list them
    let missingFields = [];


    if (!closeKm) missingFields.push("closeKm");
    if (!closeHr) missingFields.push("closeHr");
    if (!totalKm) missingFields.push("totalKm");
    if (!formId) missingFields.push("formId");

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(", ")}` 
      });
    }

    // ✅ Step 2: Save Signatures as Images
    
  
    // ✅ Step 3: Check if Form Exists & Is Already Submitted
    const existingTrip = await prisma.tripSheet.findUnique({
      where: { formId: formId },
      select: { submitted: true }
    });

    if (!existingTrip) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (existingTrip.submitted) {
      return res.status(400).json({ message: "Form already submitted" });
    }

    // ✅ Step 4: Update the Trip Record
    const updatedTrip = await prisma.tripSheet.update({
      where: { formId: formId },
      data: {
      
        closeKm,
        closeHr,
        totalKm,
        totalHr, // Added this 
      
        parkingCharges: parkingCharges ? parseFloat(parkingCharges) : null,
        toolCharges: toolCharges ? parseFloat(toolCharges) : null,
        submitted: true,
        review:rating,
        status:"Pending",
        extraHr,
        extraKm,
        closingDate: closeDate,
        driverSubmitted: new Date() // ✅ Sets current timestamp


      },
    });

    // ✅ Step 5: Send Success Response
    return res.status(200).json({ 
      message: "Trip details updated successfully", 
      updatedTrip 
    });

  } catch (error) {
    console.error("Error in addTripSheet:", error);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};


export const updateTripStatusController = async (req, res) => {
  const { tripId, status } = req.body;

  if (!tripId || !status) {
    return res.status(400).json({ message: "tripId and status are required" });
  }

  try {
    const updatedTrip = await updateTripStatus(tripId, status);

    return res.status(200).json({
      message: "Trip status updated successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update trip status",
      error: error.message,
    });
  }
};



export  const getFormdata =async (req, res) => {
  const { formId } = req.params;

  try {
    // Query the database to find the trip sheet by formId
    const tripSheet = await prisma.tripSheet.findUnique({
      where: { formId: formId },
      include:{
        categoryRel:true
      }
    });

    if (tripSheet) {
      res.status(200).json({
        message: "Trip sheet fetched successfully",
        data: tripSheet,
      });
    } else {
      res.status(404).json({
        message: "Trip sheet not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
}




export const getVehicleOnly = async (req, res) => {
  const { search } = req.query;
  console.log("The method is invoked");

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        vehicleNo: {
          contains: search || "", // Allow empty search, so it returns all vehicles
          mode: "insensitive", // Case-insensitive search
        },
      },
      include: {
        drivers:true, 
        vendor: {
          select: {
            name: true, // Fetch vendor name
          },
        },
      },
      take: 10, // Limit results to 10 for performance
    });

    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getCompanyDetails=async (req, res) => {
  const { search } = req.query;
console.log("the method  getComapany details got invoked");

  try {
    const vehicles = await prisma.company.findMany({
      where: {
        name: {
          contains: search, // 🔥 Fetch vehicles matching search input
          mode: "insensitive", // Case insensitive search
        },
      },
      
      include:{
        customers:true
       }
    }); 

    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


export const searchVendor=async (req, res) => {
  const { search } = req.query;
console.log("the method  search vendor  got  invoked");

  try {
    const vehicles = await prisma.vendor.findMany({
      where: {
     name: {
          contains: search, // 🔥 Fetch vehicles matching search input
          mode: "insensitive", // Case insensitive search
        },
      },
      take: 10, // 🔥 Limit results to 10 for performance
    }); 

    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


export const deleteDriver = async (req, res) => {
  try {
    const { driverId } = req.query
    // Ensure driverId is provided
    if (!driverId) {
      return res.status(400).json({ success: false, error: "Driver ID is required" });
    }
    const id = parseInt(driverId, 10);

    // Validate if the conversion was successful
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid Driver ID" });
    }
    // Delete driver by ID
    const deletedDriver = await prisma.driver.delete({
      where: { id:id },
    });

    return res.status(200).json({
      success: true,
      message: "Driver deleted successfully",
      data: deletedDriver,
    });
  } catch (error) {
    console.error("Error deleting driver:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Driver not found",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};




export const deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.query
    // Ensure driverId is provided
    if (!customerId) {
      return res.status(400).json({ success: false, error: "Driver ID is required" });
    }
    const id = parseInt(customerId, 10);

    // Validate if the conversion was successful
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid Driver ID" });
    }
    // Delete driver by ID
    const deletedCustomer = await prisma.customers.delete({
      where: { id:id },
    });

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      data: deleteCustomer,
    });
  } catch (error) {
    console.error("Error deleting driver:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Driver not found",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};




export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params
    // Ensure driverId is provided
    if (!id) {
      return res.status(400).json({ success: false, error: "Driver ID is required" });
    }
    const Id = parseInt(id, 10);

    // Validate if the conversion was successful
    if (isNaN(Id)) {
      return res.status(400).json({ success: false, error: "Invalid Driver ID" });
    }
    // Delete driver by ID
    const deletedAdmin= await prisma.user.delete({
      where: { id:Id },
    });

    return res.status(200).json({
      success: true,
      message: "Driver deleted successfully",
      data: deletedAdmin,
    });
  } catch (error) {
    console.error("Error deleting driver:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Driver not found",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};


export const updateOpenDetails=async(req,res)=>{

  try {

  const {tripId,kmValue}= req.body
  console.log(" this is the data ",req.body);
  
      const  updated= await prisma.tripSheet.update({
      where:{formId:tripId},
      data:{
        openKm:kmValue}  })
    
        res.status(200).json({
          success: true,
          message: "Trip sheet updated successfully",
          data: updated,
        });
  } catch (error) {
    console.error("Error updating trip sheet:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


export const updateGuestSignature = async (req, res) => {
  try {
    const { tripId, Guestsignature } = req.body;

    if (!tripId || !Guestsignature) {
      return res.status(400).json({
        success: false,
        message: "tripId and Guestsignature are required.",
      });
    }

    const guestSignatureFileName = saveSignatureImage(Guestsignature, "guest");

    if (!guestSignatureFileName) {
      return res.status(500).json({
        success: false,
        message: "Failed to save guest signature image.",
      });
    }

    const updatedSignature = await prisma.tripSheet.update({
      where: {
        formId: tripId,
      },
      data: {
        guest_url: guestSignatureFileName,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Guest signature updated successfully.",
      data: updatedSignature,
    });
  } catch (error) {
    console.error("Error updating guest signature:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Could not update guest signature.",
      error: error.message,
    });
  }
};