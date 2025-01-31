import { saveSignatureImage } from "../services/SaveSIgnatureService.js";
import { addTrip, getUser, updateTripStatus } from "../services/UserService.js";

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

export const TripDetailsController = async (req, res) => {
  const { Driversignature, Guestsignature } = req.body;
  // console.log("🔹 Received Request Body:", req.body);
  try {
    // Validate required fields
    if (!Driversignature || !Guestsignature) {
      return res.status(400).json({ message: "Driver and Guest signatures are required" });
    }

    // Save signatures as images
    const driverSignatureFileName = saveSignatureImage(Driversignature, "driver");
    const guestSignatureFileName = saveSignatureImage(Guestsignature, "guest");

    // Ensure both signatures are saved successfully
    if (!driverSignatureFileName || !guestSignatureFileName) {
      return res.status(500).json({ message: "Failed to save signatures" });
    }

    // Call service to add trip
    const trip = await addTrip(req, driverSignatureFileName, guestSignatureFileName);

    if (trip) {
      return res.status(201).json({
        message: "Trip details added successfully",
        trip, // Return the trip data for verification
        success:true
      });
    } else {
      return res.status(500).json({ message: "Failed to add trip details" });
    }
  } catch (error) {
    console.error("Error in TripDetailsController:", error);
    return res.status(500).json({
      message: "Something went wrong while saving trip details",
      error: error.message,
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


