import express from "express"
import {register, login, logout, getMe} from "../controllers/authController.js"
import { protectRoute } from "../middleware/authmiddleware.js"
import { User } from "../models/userModel.js";
import httpStatus from "http-status"

const router = express.Router()

router.post("/register",register);
router.post("/login",login)

router.get("/me",protectRoute,getMe)


router.post("/logout",logout)

export default router