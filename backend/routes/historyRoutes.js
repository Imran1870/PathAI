import express from "express"
import { protectRoute } from "../middleware/authmiddleware.js"
import {getHistory} from "../controllers/analyzeResumeController.js"
const router = express.Router()

router.get("/history",protectRoute,getHistory)

export default router