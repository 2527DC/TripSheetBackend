import { getUser } from "../services/UserService.js"

export const  login= async(req,res) =>
    {
     try {
        const result = await getUser(req)

        if (result.sucess) {
        res.status(200).json({
        message: result.message,
        role:result.data.role
    })         
        }
     } catch (error) {

        console.log(error);
        
        res.status(500).json({
            message: "An error occurred, couldn't fetch the data",
            
          });
     }   
    }