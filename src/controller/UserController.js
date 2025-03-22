import { saveSignatureImage } from "../services/SaveSIgnatureService.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const addTripSheet = async (req, res) => {
  try {
    const { 
   
      Guestsignature, 
      openKm, 
      openHr, 
      closeKm, 
      closeHr, 
      totalKm,
      totalHr,   // Added this 
      formId, 
      parkingCharges, 
      toolCharges,
      rating
    } = req.body;

    console.log("Received TripSheet request:", req.body);

    if (totalHr) {
      console.log("Total hours provided:", totalHr);
    } else {
      console.log("Total hours not sent.");
    }

    // ✅ Step 1: Check for missing fields and list them
    let missingFields = [];

   
    if (!Guestsignature) missingFields.push("Guestsignature");
    if (!openKm) missingFields.push("openKm");
    if (!openHr) missingFields.push("openHr");
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
    
    const guestSignatureFileName = saveSignatureImage(Guestsignature, "guest");

    if ( !guestSignatureFileName) {
      return res.status(500).json({ message: "Failed to save signatures" });
    }

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
        openKm,
        openHr,
        closeKm,
        closeHr,
        totalKm,
        totalHr, // Added this 
        guest_url: guestSignatureFileName,
        parkingCharges: parkingCharges ? parseFloat(parkingCharges) : null,
        toolCharges: toolCharges ? parseFloat(toolCharges) : null,
        submitted: true,
        review:rating,
        status:"Pending"

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