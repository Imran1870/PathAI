import express from "express"
import cors from "cors"; // Add to your imports
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes.js"
import uploadResumeRoutes from "./routes/uploadResumeRoutes.js"
import dotenv from "dotenv"
import analyzeResumeRoutes from "./routes/analyzeResumeRoutes.js"
import historyRoutes from "./routes/historyRoutes.js"
const  app = express()
dotenv.config()
import { connectDB } from "./config/db.js"
import { getHistory } from "./controllers/analyzeResumeController.js";
const PORT = process.env.PORT || 5000;
// Add this before your routes
app.use(cors({
    origin: "http://localhost:5173", // The port your React app will run on
    credentials: true // ABSOLUTELY CRUCIAL: This allows the HTTP-only JWT cookie to be sent back and forth
}));

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/resumes",uploadResumeRoutes)
app.use("/api/analyses",analyzeResumeRoutes)
app.use("/api/analyses",historyRoutes)
app.listen(PORT, async()=>{
    await connectDB();
    console.log('Server running in localhost 5000');
})

