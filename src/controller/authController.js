

import jwt from 'jsonwebtoken';
import { prisma } from '../services/prismaclient.js';

 export const login = async(req,res) => { 
   const { email, password } = req.body;
   try {
      
      const foundUser= await prisma.user.findUnique({
         where:{email }
           
         })


        // Check if user exists
            if (!foundUser) {
              return res.status(401).json({ message: 'Invalid email' });
            }

      // Check if password matches
      // Note: In a real application, you should use password hashing (like bcrypt) 
      // instead of plain text comparison
      if (password !== foundUser.password) {
        return res.status(401).json({ message: 'Wrong password' });
     }
         //  generate jwt token 
        const token = jwt.sign(
         {role:foundUser.role},
       process.env.JWT_SECRET,
       { expiresIn: '1h' }
        )


        res.json({ token,
         message:" login successfull"
        });

       

   } catch (error) {
      console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  
   }

   }



    export const getCustomerByCompany= async(req,res)=>{  
      try {
        const companyId = parseInt(req.params.companyId);
        console.log(" this is the companyId" ,companyId);
        const fetchCustomers = await  prisma.company.findUnique({
          where: { id: companyId },
          select :{
             customers: true 
          }
        })
        if (!fetchCustomers) {
        res.status(400).json(" no customers in this company ")
        }
        res.status(200).json(fetchCustomers)
        
      } catch (error) {
        console.log(" Error" ,error);
        
        res.status(500).json({
          message: " something went wrong ",
          error:error
        })
      }
    }


    export const createCustomer=async(req,res)=>{

      try {
        const companyId = parseInt(req.params.companyId);
        const {customerName,phoneNumber}= req.body;

        const customer= await prisma.customers.create({
          data:{
            customerName,
            phoneNo:phoneNumber,
            companyId
          }
        })

        res.status(201).json({
          message:"customer created succesfuly",
          customer:customer
          
        })

      } catch (error) {
        if (error.code === "P2002") {
          const existingField = error.meta?.target?.[0]; // Extracts the field that caused the conflict
        
          return res.status(409).json({
            message: `A customer with this ${existingField} already exists.`,
            existingField: existingField,
          });
        }
        
    
        console.error("Error:", error);
        res.status(500).json({ message: "Something went wrong", error }); // ✅ 500 Internal Server Error
      }
        
 
    }