import express from "express"
import {register, login, logout} from "../controllers/authController.js"
import { protectRoute } from "../middleware/authmiddleware.js"
import { User } from "../models/userModel.js";
import httpStatus from "http-status"

const router = express.Router()

router.post("/register",register);
router.post("/login",login)

router.get("/me",protectRoute,async(req,res)=>{
    try{
        const currUser = await User.findById(req.userId).select("-password");
        if(!currUser){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json(currUser)

    }
    catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error fetching user profile" });
    }
})


router.post("/logout",logout)

export default router