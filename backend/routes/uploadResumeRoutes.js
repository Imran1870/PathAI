import { protectRoute } from "../middleware/authmiddleware.js";
import { upload } from "../middleware/uploadResumemiddleware.js";
import {uploadResumeToCloudinary} from "../controllers/uploadResumeController.js"
import express from "express"

const router = express.Router()

router.post("/upload",protectRoute,upload.single("resume"),uploadResumeToCloudinary)
export default router