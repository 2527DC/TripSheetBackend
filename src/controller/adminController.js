import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from 'url';
import path from 'path';
import { body, validationResult } from "express-validator";
import { log } from 'console';
import { saveSignatureImage } from '../services/SaveSIgnatureService.js';
import { prisma } from "../services/prismaclient.js";





export const validateGenerateLink = [
  body("acType").notEmpty().withMessage("acType is required"),
  body("driverPh").notEmpty().withMessage("Driver Phone Number is reduired"),
  body("city").notEmpty().withMessage("City Needed"),
  body("driver").notEmpty().withMessage("Driver is required"),
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
  body("companyId").notEmpty().withMessage("companyId is required"),
  body("categoryId").notEmpty().withMessage("companyId is required"),
  body("driverId").notEmpty().withMessage("driverId is required"),
  body("vehicleId").notEmpty().withMessage("vehicleId is required"),
  body("vendorId").notEmpty().withMessage("vendorId is required"),
  body("customerId").notEmpty().withMessage("customerId is required"),

  

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
    createdAt,
    driverPh,
    city,
    vendorId,
    vehicleId,
    categoryId,
    companyId,
    customerId,
    driverId,

    
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
        createdAt,
        driverPh,
        city,
        vendorId,
        vehicleId,
        categoryId,
        companyId,
        customerId,driverId
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
          name:vendorName,
          phoneNo:vendorPh
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

export const createCompany = async (req, res) => {
  const { companyName } = req.body;

  // Validation: Ensure companyName is provided
  if (!companyName) {
    return res.status(400).json({ message: "Company name is required" }); // ✅ `return` to stop further execution
  }

  try {
    // Create new company in Prisma
    const newCompany = await prisma.company.create({
      data: { name: companyName },
    });

    return res.status(201).json({
      message: "Company created successfully",
      company: newCompany, // ✅ Changed key to `company` (not `companyName`, as it's an object)
    });

  } catch (error) {
    if (!res.headersSent) { // ✅ Prevents duplicate responses
      if (error.code === "P2002") {
        const duplicateFields = error.meta?.target || ["unknown field"];
        return res.status(400).json({
          message: `The ${duplicateFields.join(", ")} already exists`,
        });
      }

      return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  }
};



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
       name: driverName,
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
      return res.status(400).json({ message: "All fields are required", adminName, email, password, role });
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


export const createCategory = async (req, res) => {
  try {
    const { category, hours, KM } = req.body;

    // Validate required fields
    if (!category) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Create category (without checking manually for duplicates)
    const created = await prisma.category.create({
      data: {
        name:category,
        hours: hours ?? null, // Optional field
        KM: KM ?? null,       // Optional field
      },
    });

    res.status(201).json({ message: "Category created successfully", category: created });

  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Category already exists" });
    }

    res.status(500).json({
      message: "Something went wrong on the server",
      error: error.message,
    });
  }
};

export const fetchCategory= async(req,res)=>{

  try {
    const category= await prisma.category.findMany()

    if (category) {
      res.status(200).json(category)
    }
  } catch (error) {
    console.log("Error " ,error);
    
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


export const fetchPendingTripsheet = async (req, res) => {
  try {
    const pendingTrips = await prisma.tripSheet.findMany({
      where: {
        status: "Pending", // Assuming 'status' field exists and stores pending state
      },
    });

    return res.status(200).json({ success: true, pendingTrips: pendingTrips });
  } catch (error) {
    console.error("Error fetching pending trip sheets:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch pending trip sheets" });
  }
};

export const fetchApprovedTripsheet = async (req, res) => {
  try {
    const approvedTrips = await prisma.tripSheet.findMany({
      where: {
        status: "Approved", // Assuming 'status' field exists and stores pending state
      },
    });

    return res.status(200).json({ success: true, approvedTrips: approvedTrips });
  } catch (error) {
    console.error("Error fetching pending trip sheets:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch pending trip sheets" });
  }
};


export const fetchRejectedTripsheet = async (req, res) => {
  try {
    const rejectedTrips = await prisma.tripSheet.findMany({
      where: {
        status: "Rejected", // Assuming 'status' field exists and stores pending state
      },
    });

    return res.status(200).json({ success: true, rejectedTrips: rejectedTrips });
  } catch (error) {
    console.error("Error fetching pending trip sheets:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch pending trip sheets" });
  }
};


  export const fetchUsersONSearchType =async (req, res) => {
  try {
    const { type, query } = req.query;

    if (!type || !query) {
      return res.status(400).json({ error: "Search type and query are required" });
    }

    let results = [];

    switch (type) {
      case "Driver":
        results = await prisma.driver.findMany({
          where: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          select: { id: true, name: true },
          take: 10, // Limit suggestions
        });
        break;

      case "Company":
        results = await prisma.company.findMany({
          where: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          select: { id: true, name: true },
          take: 10,
        });
        break;

      case "Vendor":
        results = await prisma.vendor.findMany({
          where: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          select: { id: true, name: true },
          take: 10,
        });
        break;

      case "Customer":
        results = await prisma.customers.findMany({
          where: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          select: { id: true, name: true },
          take: 10,
        });
        break;

      default:
        return res.status(400).json({ error: "Invalid search type" });
    }

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTripsBySearchQueryAndDate(req, res) {
  try {
      const { searchQuery, fromDate, toDate, selectedStatus, selectedType } = req.query;

      console.log(" this is the request " ,req.query);
      console.log(" this is the request " ,req.body);
      // Validate all required parameters at once
      if (!searchQuery?.trim() || !fromDate || !toDate || !selectedType?.trim()) {
          return res.status(400).json({ 
              message: "Missing required parameters: searchQuery, fromDate, toDate, and selectedType are required" 
          });
      }

      // Predefined valid types for quick validation
      const validTypes = {
          driver: 'driverName',
          customer: 'customer',
          company: 'company',
          vendor: 'vendorName'
      };

      const searchField = validTypes[selectedType.toLowerCase()];
      if (!searchField) {
          return res.status(400).json({ 
              message: "Invalid selectedType. Must be one of: driver, customer, company, vendor" 
          });
      }

      // Convert dates once and reuse
      const startDate = new Date(`${fromDate}T00:00:00.000Z`);
      const endDate = new Date(`${toDate}T23:59:59.999Z`);

      // Validate dates
      if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
          return res.status(400).json({ 
              message: "Invalid date range" 
          });
      }

      // Build search condition efficiently
      const searchCondition = {
          [searchField]: {
              contains: searchQuery.trim(),
              mode: "insensitive"
          }
      };

      // Build where clause with minimal conditions
      const whereClause = {
          ...searchCondition,
          createdAt: {
              gte: startDate,
              lte: endDate
          },
          submitted: true,
          ...(selectedStatus && selectedStatus !== "All" && {
              status: {
                  equals: selectedStatus,
                  mode: "insensitive"
              }
          })
      };

      const trips = await prisma.tripSheet.findMany({
          where: whereClause,
          orderBy: { createdAt: "asc" },
         
      });

      // Single response point with ternary
      return res.status(200).json({
          message: trips.length ? "Trips retrieved successfully" : "No trips found",
          data: trips
      });

  } catch (error) {
      console.error("Error fetching trip sheets:", error);
      return res.status(500).json({ 
          message: "Internal server error",
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
  }
}



export const updateDriver = async (req, res) => {
  try {
    const { driverId, driverName, phoneNo, vehicleId } = req.body;

    // Validate required fields
    if (!driverId || !driverName || !phoneNo || !vehicleId) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Update driver
    const updatedDriver = await prisma.driver.update({
      where: { id: driverId }, // Match driver by ID
      data: {
        name: driverName,
        phoneNo: phoneNo,
        vehicleId: vehicleId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Driver updated successfully",
      data: updatedDriver,
    });

  } catch (error) {
    console.error("Error updating driver:", error);

    // Handle Prisma Unique Constraint Error (P2002)
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        error: "Phone number already exists. Please use a different phone number.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};



export const updateCustomer = async (req, res) => {
  try {
    const { customerId, customerName, phoneNo, } = req.body;

    // Validate required fields
    if (!customerId || !customerName || !phoneNo ) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Update driver
    const updatedDriver = await prisma.customers.update({
      where: { id: customerId }, // Match driver by ID
      data: {
        name: customerName,
        phoneNo: phoneNo,
  
      },
    });

    return res.status(200).json({
      success: true,
      message: "Driver updated successfully",
      data: updatedDriver,
    });

  } catch (error) {
    console.error("Error updating driver:", error);

    // Handle Prisma Unique Constraint Error (P2002)
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        error: "Phone number already exists. Please use a different phone number.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const { adminId,password} = req.body;
console.log(" this is the body ",req.body);

    // Validate required fields
    if (!adminId || !password ) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Update driver
    const updatedDriver = await prisma.user.update({
      where: { id: adminId}, // Match driver by ID
      data: {
       password
  
      },
    });

    return res.status(200).json({
      success: true,
      message: "Driver updated successfully",
      data: updatedDriver,
    });

  } catch (error) {
    console.error("Error updating driver:", error);

    // Handle Prisma Unique Constraint Error (P2002)
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        error: "Phone number already exists. Please use a different phone number.",
      }); 
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
