import { saveSignatureImage } from "../services/SaveSIgnatureService.js";
import {  getUser} from "../services/UserService.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const login = async (req, res) => {
  console.log("The login method in the controller got invoked");

  try {
    const result = await getUser(req);

    if (result.success) {
      // Success response
      return res.status(result.status).json({
        success: true,
        message: result.message,
        role: result.data?.role,
      });
    } else {
      // Failure response (wrong credentials or other error)
      return res.status(result.status).json({
        success: false,
        message: result.message,
        error: result.error || null, // Include error message if available
      });
    }
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
};

export const addTripSheet = async (req, res) => {
  try {
    const { 
      Driversignature, 
      Guestsignature, 
      openKm, 
      openHr, 
      closeKm, 
      closeHr, 
      totalKm,
      totalHr, // aded this 
      formId, 
      parkingCharges, 
      toolCharges 
    } = req.body;

    // ✅ Step 1: Validate Required Fields
    if (!Driversignature || !Guestsignature || !openKm || !openHr || !closeKm || !closeHr || !totalKm || !formId) {
      return res.status(400).json({ message: "Missing required trip details" });
    }

    // ✅ Step 2: Save Signatures as Images
    const driverSignatureFileName = saveSignatureImage(Driversignature, "driver");
    const guestSignatureFileName = saveSignatureImage(Guestsignature, "guest");

    if (!driverSignatureFileName || !guestSignatureFileName) {
      return res.status(500).json({ message: "Failed to save signatures" });
    }

    // ✅ Step 3: Check if Form Exists & Is Already Submitted
    const existingTrip = await prisma.form.findUnique({
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
    const updatedTrip = await prisma.form.update({
      where: { formId: formId },
      data: {
        openKm,
        openHr,
        closeKm,
        closeHr,
        totalKm,
        totalHr, // aded this 
        driver_url: driverSignatureFileName,
        guest_url: guestSignatureFileName,
        parkingCharges: parkingCharges ? parseFloat(parkingCharges) : null,
        toolCharges: toolCharges ? parseFloat(toolCharges) : null,
        submitted: true
      },
    });

    // ✅ Step 5: Send Success Response
    return res.status(200).json({ 
      message: "Trip details updated successfully", 
      updatedTrip 
    });

  } catch (error) {
    console.error("Error in addTripSheet:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
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
    const tripSheet = await prisma.form.findUnique({
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