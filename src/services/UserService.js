
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUser = async (req) => {
  console.log("The login method in the service got invoked");

  const { email, password } = req.body;

  try {
    // Check if the email is provided
    if (!email || !password) {
      return {
        message: "Email and password are required",
        success: false,
        status: 400, // Bad Request
      };
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found:", email);
      return {
        message: "User not found",
        success: false,
        status: 400, // Not Found
      };
    }
    // Check if the password matches
    if (user.password !== password) {
      console.log("Incorrect password for user:", email);
      return {
        message: "Incorrect password",
        success: false,
        status: 401, // Unauthorized
      };
    }

    // If everything is correct, return success
    return {
      message: "Login successful",
      success: true,
      data: user,
      status: 200, // OK
    };
  } catch (error) {
    console.error("Error in getUser service:", error);

    // Handle different types of errors
    if (error instanceof PrismaClientKnownRequestError) {
      return {
        message: "Database error occurred",
        success: false,
        error: error.message,
        status: 500, // Internal Server Error
      };
    } else if (error instanceof PrismaClientValidationError) {
      return {
        message: "Validation error",
        success: false,
        error: error.message,
        status: 400, // Bad Request
      };
    } else {
      return {
        message: "An unexpected error occurred",
        success: false,
        error: error.message,
        status: 500, // Internal Server Error
      };
    }
  } finally {
    // Disconnect Prisma client (optional)
    await prisma.$disconnect();
  }
};


export const addTrip = async (req, driver_url, guest_url) => {
  try {
    const {
      vehicleType,
      vehicleNo,
      driverName,
      date,
      openKm,
      openHr,
      closeKm,
      closeHr,
      totalKm,
      totalHr,
      ms,
      reporting,
      bookedBy,
      journeyDetails,
      status,
    } = req.body;

    // Ensure required fields are present
    if (!vehicleType || !vehicleNo || !driverName || !date) {
      throw new Error("Missing required trip details");
    }

    // Create new trip entry
    const newTrip = await prisma.tripsheet.create({
      data: {
        vehicleType,
        vehicleNo,
        driverName,
        date: new Date(date),
        openKm,
        openHr,
        closeKm,
        closeHr,
        totalKm,
        totalHr,
        ms,
        reporting,
        bookedBy,
        journeyDetails,
        status,
        driver_url,
        guest_url,
      },
    });

    return newTrip;
  } catch (error) {
    console.error("Error in addTrip:", error);
    throw new Error(error.message || "Database error while adding trip details");
  }
};


export const updateTripStatus = async (tripId, newStatus) => {
  try {
    const updatedTrip = await prisma.tripsheet.update({
      where: { id: tripId }, // Find trip by ID
      data: { status: newStatus }, // Update only the status field
    });

    return updatedTrip;
  } catch (error) {
    console.error("Error updating trip status:", error);
    throw new Error("Failed to update trip status");
  }
};




   export const   tripShett=  async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query; // Default: page 1, 10 items per page
    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({ success: false, message: "Invalid page or limit values" });
    }

    const skip = (page - 1) * limit;

    // Fetch trips with pagination
    const trips = await prisma.tripsheet.findMany({
      skip: skip,
      take: limit,
      orderBy: { id: "desc" }, // Order by latest trips (optional)
    });

    // Get total count of trips
    const totalTrips = await prisma.tripsheet.count();

    res.status(200).json({
      success: true,
      data: trips,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTrips / limit),
        totalItems: totalTrips,
      },
    });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


// Update only the status field of a Tripsheet
export const UpdateStatus= async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    // Check if the Tripsheet with the given ID exists
    const existingTripsheet = await prisma.tripsheet.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTripsheet) {
      return res.status(404).json({ error: "Tripsheet not found" });
    }

    // If found, proceed with the update
    const updatedTripsheet = await prisma.tripsheet.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json({ message: "Status updated successfully", updatedTripsheet });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}