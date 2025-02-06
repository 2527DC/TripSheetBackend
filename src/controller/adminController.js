import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from 'url';
import path from 'path';

const prisma = new PrismaClient();

// Generate a unique form link
export const generatelink = async (req, res) => {
  const formId = uuidv4();
  const {
    acType,
    driver,
    dropAddress,
    passengerName,
    passengerPhoneNumber,
    reportingAddress,
    vehicle,
    reportingTime,
    vendor,
    vehicleType,
  } = req.body;

  console.log("Request Body:", req.body);

  // Validation: Check if any required field is missing
  const requiredFields = {
    acType,
    driver,
    dropAddress,
    passengerName,
    passengerPhoneNumber,
    reportingAddress,
    vehicle,
    reportingTime,
    vendor,
    vehicleType,
  };

  const missingFields = Object.keys(requiredFields).filter(
    (key) => !requiredFields[key]
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const newTripsheet = await prisma.form.create({
      data: {
        formId,
        drivername: driver,
        vehicleNo: vehicle,
        passengerName,
        passengerPh: passengerPhoneNumber,
        reportingTime,
        reportingAddress,
        dropAddress,
        acType,
        vendor,
        vehicleType,
      },
    });

    res.status(201).json({
      message: "Trip created successfully",
      data: newTripsheet,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
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
  

  export const getVendors = async (req, res) => {
    try {
      const vendorsList = await prisma.vendor.findMany({
        select: {
          id:true,
          vendorName: true, // Select only the vendorName field
        },
      });
  
      if (vendorsList.length === 0) {
        return res.status(404).json({ message: "No vendors found" });
      }
  
      return res.status(200).json(vendorsList);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      return res.status(500).json({ message: "Failed to fetch vendors" });
    }
  };


  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  export const getImage=(req, res) => {
  console.log("method got invoked");

  const { imageName } = req.params;
  const imagePath = path.join(__dirname, 'src', '../../signatures', imageName);

  console.log('Computed image path:', imagePath); // Log the full path

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
}

export const getForms = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc" } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({ success: false, message: "Invalid page or limit values" });
    }

    const skip = (page - 1) * limit;

    const whereClause = {
        OR: [
          { vendor: { contains: search, mode: 'insensitive' } },
          { drivername: { contains: search, mode: 'insensitive' } },
          { vehicleNo: { contains: search, mode: 'insensitive' } },
          { vehicleType: { contains: search, mode: 'insensitive' } },
          { passengerName: { contains: search, mode: 'insensitive' } },
          { passengerPh: { contains: search, mode: 'insensitive' } },
          { reportingAddress: { contains: search, mode: 'insensitive' } },
          { dropAddress: { contains: search, mode: 'insensitive' } },
          { acType: { contains: search, mode: 'insensitive' } },
        ],
      };

    const orderByClause = {};
    orderByClause[sortBy] = sortOrder;


    const forms = await prisma.form.findMany({
      where: whereClause,
      skip: skip,
      take: limit,
      orderBy: orderByClause,
    });

    const totalForms = await prisma.form.count({ where: whereClause });

    res.status(200).json({
      success: true,
      data: forms,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalForms / limit),
        totalItems: totalForms,
      },
    });
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


 export const getdata=async (req, res) => {
  try {
    // Get pagination parameters from query params
    let { page, limit } = req.query;

    // Convert to numbers and set defaults
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch paginated data
    const users = await prisma.form.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        id: "asc", // Change as needed
      },
    });

    // Get total count of records
    const totalUsers = await prisma.form.count();

    res.json({
      success: true,
      data: users,
      pagination: {
        totalRecords: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}




export const updateTripStatus=async (req, res) => {
  
  const { status ,id} = req.body; // Assuming you're updating the 'name' field

  try {
    // Update the user in the database
    const updatedUser = await prisma.form.update({
      where: { formId: id }, // Find user by ID
      data: { status}, // Update the name field
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      updatedstatus:status
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};
