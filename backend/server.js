import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"; // Add to your imports
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes.js"
import uploadResumeRoutes from "./routes/uploadResumeRoutes.js"
import analyzeResumeRoutes from "./routes/analyzeResumeRoutes.js"
import historyRoutes from "./routes/historyRoutes.js"
const  app = express()

import { connectDB } from "./config/db.js"
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
    "http://localhost:5173",
    "https://path-ai-self.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/resumes",uploadResumeRoutes)
app.use("/api/analyses",analyzeResumeRoutes)
app.use("/api/analyses",historyRoutes)
// server.js — connect DB first, then start listening
const startServer = async () => {
    await connectDB();           // ← DB ready before accepting traffic
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer().catch((err) => {
    console.error("Fatal startup error:", err);
    process.exit(1);
});


