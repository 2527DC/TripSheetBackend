import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from 'url';
import path from 'path';
import { body, validationResult } from "express-validator";
import { log } from 'console';
import { saveSignatureImage } from '../services/SaveSIgnatureService.js';
import { prisma } from "../services/prismaclient.js";





export const validateGenerateLink = [
  body("acType").notEmpty().withMessage("acType is required"),
  body("driver").notEmpty().withMessage("driver is required"),
  body("category").notEmpty().withMessage("category is required"),
  body("dropAddress").notEmpty().withMessage("dropAddress is required"),
  body("customer").notEmpty().withMessage("passengerName is required"),
  body("customerPh")
    .notEmpty()
    .withMessage("passengerPhoneNumber is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("reportingAddress")
    .notEmpty()
    .withMessage("reportingAddress is required"),
  body("vehicle").notEmpty().withMessage("vehicle is required"),
  body("vendorName").notEmpty().withMessage("vendorName is required"),
  body("reportingTime").notEmpty().withMessage("reportingTime is required"),
  body("vehicleType").notEmpty().withMessage("vehicleType is required"),
  body("company").notEmpty().withMessage("company is required"),
];

export const generatelink = async (req, res) => {
  const errors = validationResult(req);

  console.log(" this is the req " ,req.body);
  
  if (!errors.isEmpty()) {  
    // Create a structured response that tells exactly what is missing
    const missingFields = errors.array().map(err => ({
      field: err.param, // Field name that caused the error
      message: err.msg  // Error message
    }));

    return res.status(400).json({ 
      message: "Validation failed",
      missingFields, // Sending detailed missing fields
    });
  }

  const formId = uuidv4();
  const {
    acType,
    driver,
    dropAddress,
    customer,
    customerPh,
    reportingAddress,
    vehicle,
    reportingTime,
    vendorName,
    vehicleType,  
    company,
    category,
    createdAt
  } = req.body;

  console.log("Request Body:", req.body);

  try {
    const newTripsheet = await prisma.tripSheet.create({
      data: {
        formId,
        driverName: driver,
        vehicleNo: vehicle,
         customer,
        customerPh,
        reportingTime,
        reportingAddress,
        dropAddress,
        acType,
        vehicleType,
        vendorName,
        company,
        category,
        createdAt
      },
    });

    res.status(201).json({
      message: "Trip created successfully",
      data: newTripsheet,
    });

  } catch (error) {
    console.error("Error:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        message: `A trip with the same ${error.meta.target.join(", ")} already exists.`,
      });
    }

    res.status(500).json({
      message: "Database error",
      details: error.message,
    });
  }
};

  
  export const createVendor = async (req, res) => {
    const { vendorName,vendorPh} = req.body; // Change vehicleNO to vehicleNo
    try {
      const newVendor = await prisma.vendor.create({
        data: {
          vendorName,
          vendorPh
        },
      });

     
         res.status(201).json({
          message: "Vendor created successfully",
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


    const forms = await prisma.tripSheet.findMany({
      where: whereClause,
      skip: skip,
      take: limit,
      orderBy: orderByClause,
    });

    const totalForms = await prisma.tripSheet.count({ where: whereClause });

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





export const updateTripStatus=async (req, res) => {
  
  const { status ,id} = req.body; // Assuming you're updating the 'name' field

  try {
    // Update the user in the database
    const updatedUser = await prisma.tripSheet.update({
      where: { formId: id }, // Find user by ID
      data: { status ,edit:true}, // Update the name field
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



 

//  method to create a admin user 
  
// Validation middleware
export const validateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role").isIn(["admin", "user"]).withMessage("Invalid role"), // Modify as per your roles
];

export const createUser = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: "Validation errors", });
  }

  const { name, email, password, role } = req.body;

  try {
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // Hash this before storing (use bcrypt)
        role,
      },
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    if (error.code === "P2002") {
      // Extract which field is causing the unique constraint violation
      const duplicateFields = error.meta?.target || ["unknown field"];
      
      return res.status(400).json({
        message: `The following field(s) already exist: ${duplicateFields.join(", ")}`,
       
      });
    }

    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};



export const  createCompany=async (req,res)=>{
const {companyName}=req.body;

if (!companyName) {
  res.status(400).json({
    message:"company name  required "
  })}
  
  try {
    const newCompany = await prisma.company.create({
      data:{
        companyName
      }
    })
   res.status(201).json({
    message:" company created successfully ",
    companyName:newCompany
   })

  } catch (error) {
    if (error.code === "P2002") {
      // Extract which field is causing the unique constraint violation
      const duplicateFields = error.meta?.target || ["unknown field"];
      return res.status(400).json({
        message: `The  ${duplicateFields.join(", ")} already exist`,
       
      });
    }

    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}



export const updateSingleField = async (req, res) => {
  try {
    const { formId, fieldName, fieldValue, previousValues ,tripid,userName} = req.body;
  

    // ✅ Validate required fields
    if (!formId || !fieldName || fieldValue === undefined) {
      return res.status(400).json({ message: "formId, fieldName, and fieldValue are required" });
    }

    const validFields = [
      "vendorName", "driverName", "vehicleNo", "vehicleType", 
      "reportingTime", "reportingAddress", "dropAddress",
      "acType", "driver_url", "guest_url", "totalKm", "totalHr",
      "openKm", "openHr", "closeKm", "closeHr", "status", "customer", "customerPh",
      "parkingCharges", "toolCharges", "bookedBy", "company",
      "check", "submitted"
    ];

    if (!validFields.includes(fieldName)) {
      return res.status(400).json({ message: `Invalid field name: ${fieldName}` });
    }

    // ✅ Perform the update and create audit log in a transaction
    const [updatedTrip] = await prisma.$transaction([
      // Update the trip sheet
      prisma.tripSheet.update({
        where: { formId },
        data: { [fieldName]: fieldValue },
      }),
      // Create audit log entry
      prisma.auditLog.create({
        data: {
          tripSheetId:tripid, // Still need ID for relation
          editedBy:userName,
          fieldName,
          oldValue: previousValues?.toString() || null, // Use the oldValue from frontend
          newValue: fieldValue?.toString() || null,
        },
      }),
    ]);

    return res.status(200).json({
      message: `Field '${fieldName}' updated successfully to '${fieldValue}'`,
    });

  } catch (error) {
    console.error("Error updating field:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



export const validateSignature = [
  body("signature")
    .notEmpty()
    .withMessage("Signature is required.")
    .isString()
    .withMessage("Signature must be a base64 string."),
  body("type")
    .notEmpty()
    .withMessage("File type is required.")
    .isIn(["image/png", "image/jpeg"])
    .withMessage("Invalid file type. Only PNG and JPEG are allowed."),
  body("formId")
    .notEmpty()
    .withMessage("Form ID is required.")
    .isInt()
    .withMessage("Form ID must be a valid integer."),
];

export const updateSignature = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { signature, type, formId } = req.body;

  try {
    // Find the form by formId
    // const foundForm = await prisma.tripSheet.findUnique({
    //   where: { id: parseInt(formId) }, // Convert formId to integer
    // });

    // if (!foundForm) {
    //   return res.status(404).json({ error: "Form not found." });
    // }

    // Save the signature image (Assuming this function exists)
    const fileName = saveSignatureImage(signature, type);
     console.log(" this  is the file name ",fileName);

    // Determine which field to update based on type
    const updateData = type === "driver" ? { driver_url: fileName } : { guest_url: fileName };

    // Update the form record
    const updatedForm = await prisma.tripSheet.update({
      where: { formId: formId },
      data: updateData,
    });

    res.status(200).json({ message: "Signature updated successfully!", signature: fileName});
  } catch (error) {
    console.error("Error updating signature:", error);
    res.status(500).json({ error: "Failed to update signature." });
  }
};


export const cretaeCategory=async(req,res)=>{
const {category}=req.body;
if (!category) {
  res.status(400).json({
    message:"field is required "
  })
  
}
try {
  
  const newCategory=await prisma.category.create({
    data:{
      category
    }

  })
  
  res.status(201).json({
    message:" category created Successful  "
  })

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

}



  export async function getTripsByVendorAndDate(req, res) {
    try {
      const { vendorName, fromDate, toDate } = req.query;
  
      if (!vendorName || !fromDate || !toDate) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
  
      // ✅ Convert dates to UTC for accurate comparison
      const startDate = new Date(fromDate + "T00:00:00.000Z");
      const endDate = new Date(toDate + "T23:59:59.999Z");
  
      const trips = await prisma.tripSheet.findMany({
        where: {
          AND: [
            { vendorName: { equals: vendorName, mode: "insensitive" } }, // ✅ Case-insensitive match
            { createdAt: { gte: startDate, lte: endDate } }, // ✅ Ensure time range covers entire day
            { submitted: true }, // ✅ Ensure trip is submitted
          ],
        },
        orderBy: { createdAt: "asc" }, // ✅ Ensure correct ordering
      });
  
      if (trips.length === 0) {
        return res.status(200).json({ message: "No trips found", data: [] });
      }
  
      res.status(200).json({ message: "Trips retrieved successfully", data: trips });
  
    } catch (error) {
      console.error("Error fetching trip sheets:", error);
      res.status(500).json({ message: "Backend error", error: error.message });
    }
  }
  

export const createDriver = async (req, res) => {
  try {
    const { driverName, phoneNo, vehicleId } = req.body; // ✅ Fixed variable name

    // 🔴 Check if vehicleId is provided
    if (!vehicleId) {
      return res.status(400).json({ message: "vehicleId is required" });
    }

    const driver = await prisma.driver.create({
      data: {
        driverName,
        phoneNo,
        vehicle: {
          connect: { id: vehicleId }, // ✅ Properly linking vehicle
        },
      },
    });

    res.status(201).json({
      message: "Driver created successfully",
      driver,
    });

  } catch (error) {
    console.error("🚨 Error creating driver:", error);
    res.status(500).json({
      message: "Something went wrong in server",
      error: error.message,
    });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const { vehicleNo , vehicleType ,vendorId} = req.body; // ✅ Fixed variable name

    // 🔴 Check if vehicleId is provided


    const driver = await prisma.vehicle.create({
      data: {
        vehicleNo,
        vehicleType,
        vendorId
      },
    });

    res.status(201).json({
      message: "Driver created successfully",
      driver,
    });

  } catch (error) {
    console.error("🚨 Error creating driver:", error);
    res.status(500).json({
      message: "Something went wrong in server",
      error: error.message,
    });
  }
};

//  this is  for adding the admin
 export const addAdmin = async (req, res) => {
  try {
   const { adminName, email, password, role } = req.body;
    // Check if required fields are missing
    if (!adminName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // ✅ Create admin
    const admin = await prisma.user.create({
      data: { name :adminName, email, password, role },
    });

    return res.status(201).json({
      message: "Admin created successfully",
      admin,
    });

  } catch (error) {
    if (error.code === "P2002") {
      // ✅ Handle unique constraint error (duplicate entry)
      const existingField = error.meta?.target?.[0]; // Extracts which field caused the conflict

      return res.status(409).json({
        message: `An account with this ${existingField} already exists.`,
        existingField,
      });
    }

    console.error("Error:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const fetchAdmins= async(req,res)=>{

  try {
    const admins= await prisma.user.findMany()

    if (admins) {
      res.status(200).json(admins)
    }
  } catch (error) {
    res.status(500).json({
      message :" something went wrong on the server ",
      error:error
    })
  }
 

  
}

export const createCategory= async(req,res)=>{

  try {
    const {category}=req.body
    const created= await prisma.category.create({
      data:{
        name:category
      }
    })

    if (created) {
      res.status(201).json(created)
    }
  } catch (error) {
    res.status(500).json({
      message :" something went wrong on the server ",
      error:error
    })
  }  
}

export const fetchCategory= async(req,res)=>{

  try {
    const category= await prisma.category.findMany()

    if (category) {
      res.status(200).json(category)
    }
  } catch (error) {
    res.status(500).json({
      message :" something went wrong on the server ",
      error:error
    })
  }
}

export const fetchLogs= async(req,res)=>{

  try {
    const Logs= await prisma.auditLog.findMany()

    if (Logs) {
      res.status(200).json(Logs)
    }
  } catch (error) {
    res.status(500).json({
      message :" something went wrong on the server ",
      error:error
    })
  }
}
export const fetchVendors= async(req,res)=>{

  try {
    const vendor= await prisma.vendor.findMany()

    if (vendor) {
      res.status(200).json(vendor)
    }
  } catch (error) {
    res.status(500).json({
      message :" something went wrong on the server ",
      error:error
    })
  }
}
export const fetchDrivers= async(req,res)=>{

  try {
    const drivers= await prisma.driver.findMany({
      include:{
        vehicle:true
      }
    })

    if (drivers) {
      res.status(200).json(drivers)
    }
  } catch (error) {
    res.status(500).json({
      message :" something went wrong on the server ",
      error:error
    })
  }
}