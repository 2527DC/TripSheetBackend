import express from 'express'
import { login } from '../controller/UserController.js';


const router = express.Router();

router.get('/message', (req,res)=>{
    res.send("  this is the message form the router ")
});

router.post('/login',login)
export default router;