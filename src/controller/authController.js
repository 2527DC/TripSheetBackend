import { prisma } from '../services/prismaclient.js';

export const login = async (req, res) => { 
  const { email, password } = req.body;

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    // ✅ Remove password from user object before sending response
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, message: "Login successful" });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



   export const getCustomerByCompany = async (req, res) => {  
    try {
      const { companyId, companyName } = req.query; // Accept both as query parameters
  
      console.log("Received companyId:", companyId);
      console.log("Received companyName:", companyName);
  
      // Construct dynamic `where` condition based on provided input
      const whereCondition = {};
      if (companyId) whereCondition.id = parseInt(companyId);
      if (companyName) whereCondition.companyName = companyName; // Assuming `name` is the field for company name
  
      if (Object.keys(whereCondition).length === 0) {
        return res.status(400).json({ message: "Please provide either companyId or companyName" });
      }
  
      const fetchCustomers = await prisma.company.findFirst({
        where: whereCondition,
        select: {
          customers: true, // Fetch only customers
        },
      });
  
      // if (!fetchCustomers || fetchCustomers.customers.length === 0) {
      //   return res.status(404).json({ message: "No customers found for the given company" });
      // }
  
      res.status(200).json(fetchCustomers);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  };
  


    // export const createCustomer=async(req,res)=>{

    //   try {
    //     const companyId = parseInt(req.params.companyId);
    //     const {customerName,phoneNo}= req.body;

    //     const customer= await prisma.customers.create({
    //       data:{
    //         customerName,
    //         phoneNo,
    //         companyId
    //       }
    //     })

    //     res.status(201).json({
    //       message:"customer created succesfuly",
    //       customer:customer
          
    //     })

    //   } catch (error) {
    //     if (error.code === "P2002") {
    //       const existingField = error.meta?.target?.[0]; // Extracts the field that caused the conflict
        
    //       return res.status(409).json({
    //         message: `A customer with this ${existingField} already exists.`,
    //         existingField: existingField,
    //       });
    //     }
        
    
    //     console.error("Error:", error);
    //     res.status(500).json({ message: "Something went wrong", error }); // ✅ 500 Internal Server Error
    //   }
        
 
    // }


    export const createCustomer = async (req, res) => {
      try {
        const { companyId, companyName } = req.query; // ✅ Extract from query params
        const { customerName, phoneNo } = req.body; // ✅ Keep customer data in the body
    
        let company;
    
        // If `companyId` is provided, find the company directly
        if (companyId) {
          company = await prisma.company.findUnique({
            where: { id: parseInt(companyId) },
          });
        } 
        // If `companyId` is missing but `companyName` is given, find by company name
        else if (companyName) {
          company = await prisma.company.findUnique({
            where: { companyName: companyName },
          });
        }
    
        // If no company is found, return an error
        if (!company) {
          return res.status(404).json({ message: "Company not found" });
        }
    
        // Create customer and connect to found company
        const customer = await prisma.customers.create({
          data: {
            customerName,
            phoneNo,
            company: {
              connect: { id: company.id }, // ✅ Link customer to found company
            },
          },
        });
    
        res.status(201).json({
          message: "Customer created successfully",
          customer,
        });
    
      } catch (error) {
        if (error.code === "P2002") {
          const existingField = error.meta?.target?.[0];
    
          return res.status(409).json({
            message: `A customer with this ${existingField} already exists.`,
            existingField,
          });
        }
    
        console.error("Error:", error);
        res.status(500).json({ message: "Something went wrong", error });
      }
    };
    