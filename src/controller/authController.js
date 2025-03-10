

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