import express from "express"
import { protectRoute } from "../middleware/authmiddleware.js"
import {analyzeResume} from "../controllers/analyzeResumeController.js"

const router = express.Router()

router.post("/resume",protectRoute,analyzeResume)

export default router