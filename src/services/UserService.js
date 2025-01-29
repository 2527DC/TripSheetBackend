import { PrismaClient } from "@prisma/client";


const  prisma =  new PrismaClient()

  export const getUser= async (req)=>{

    const {email,password}= req.body
    try {
        const user = await prisma.user.findUnique({
            where: { email },
          });
        if (!user) {
            return {message:" user not found ",sucess:false}
            
        }
        if (user.password===password) {
            return {message:"Login sucessfull" ,sucess:true ,data :user}

        }
    } catch (error) {
        
        return{ message:" something went  wrong " ,error,sucess:false}
    }
    finally{
        await prisma.$disconnect();
    }
    

 }