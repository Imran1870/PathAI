import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import { Resume } from "../models/resumeModel.js";
import { Analysis } from "../models/analysisModel.js";

const toStringArray = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return [];
};

const parseJsonResponse = (rawResponse) => {
    try {
        return JSON.parse(rawResponse);
    } catch {
        const cleaned = rawResponse
            .replace(/^```(?:json)?/i, "")
            .replace(/```$/i, "")
            .trim();
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("AI response was not valid JSON.");
        }

        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }
};

const normalizeAnalysis = (analysisData) => ({
    matchScore: Number(analysisData.matchScore) || 0,
    missingSkills: Array.isArray(analysisData.missingSkills) ? analysisData.missingSkills : [],
    strengths: Array.isArray(analysisData.strengths) ? analysisData.strengths : [],
    suggestedProjects: Array.isArray(analysisData.suggestedProjects) ? analysisData.suggestedProjects : [],
    roadmap: Array.isArray(analysisData.roadmap) ? analysisData.roadmap : [],
    good_project_questions: Array.isArray(analysisData.good_project_questions) ? analysisData.good_project_questions : [],
});


 const analyzeResume = async (req,res)=>{
    const {resumeId,targetRole,jobDescription,currentScenario} = req.body;
    console.log("[1] analyzeResume called — resumeId:", resumeId, "| targetRole:", targetRole);

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
        return res.status(400).json({ message: "A valid resumeId is required" });
    }
    if (typeof targetRole !== "string" || typeof jobDescription !== "string" || !targetRole.trim() || !jobDescription.trim()) {
        return res.status(400).json({ message: "targetRole and jobDescription are required" });
    }
    if (!currentScenario || typeof currentScenario !== "object") {
        return res.status(400).json({ message: "currentScenario is required" });
    }
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: "Gemini API key is not configured on the server." });
    }

    const { goal = "", year = "", currentSkills } = currentScenario;
    const skillsArray = toStringArray(currentSkills);
    const storedScenario = {
        goal: String(goal).trim(),
        year: String(year).trim(),
        currentSkills: skillsArray,
    };

    console.log("[2] currentScenario parsed — goal:", storedScenario.goal, "| year:", storedScenario.year, "| skills:", skillsArray);

    try{
        console.log("[3] Looking up resume in DB...");
        const parsedResumeText = await Resume.findById(resumeId).select("parsedText");
        if (!parsedResumeText) { return res.status(404).json({message: "Resume not found"}) }
        if (!parsedResumeText.parsedText?.trim()) {
            return res.status(400).json({ message: "Resume text could not be parsed. Please upload a text-based PDF." });
        }
        console.log("[4] Resume found. Text length:", parsedResumeText.parsedText?.length);

        console.log("[5] Initialising Gemini — key present:", !!process.env.GEMINI_API_KEY);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        })

       const prompt = `
            You are an expert technical recruiter and career coach.
            I will provide a candidate's resume text, their current scenario, and a target job description.
            
            Analyze the resume against the job description.
            
            Candidate's Current Scenario:
            - Year / Status: ${storedScenario.year}
            - Goal: ${storedScenario.goal}
            - Current Skills: ${skillsArray.join(', ')}
            
            Target Role: ${targetRole}
            Job Description: ${jobDescription}
            
            Resume Text: 
            ${parsedResumeText.parsedText}
            
            Return ONLY a valid JSON object with the following structure, and nothing else and also "Provide EXACTLY 5-10 rigorous, technical interview questions based strictly on the projects and general as well listed in the resume. Focus on the architecture, challenges, and specific technologies they used. For each question, provide the ideal technical answer."
            {
                "matchScore": <number between 1-100>,
                "missingSkills": [<array of strings>],
                "strengths": [<array of strings>],
                "suggestedProjects": [ { "title": <string>, "description": <string> } ],
                "roadmap": [ { "phase": <string>, "description": <string> } ],
                "good_project_questions": [ { "question": <string>, "answer": <string> } ]
            }
        `;

        console.log("[6] Sending prompt to Gemini...");
       const result = await model.generateContent(prompt)
       console.log("[7] Gemini responded.");

       const aiResponse = result.response.text()  //this is a json string
       console.log("[8] Raw AI response length:", aiResponse?.length);

       const analysisData = normalizeAnalysis(parseJsonResponse(aiResponse));
       console.log("[9] JSON parsed — matchScore:", analysisData.matchScore);

       const newAnalysis = new Analysis({
         userId:req.userId,
         resumeId:resumeId,
         targetRole:targetRole.trim(),
         jobDescription:jobDescription.trim(),
         currentScenario: storedScenario,
         analysisResult: analysisData
       })
       console.log("[10] Saving analysis to DB...");
       await newAnalysis.save()
       console.log("[11] Analysis saved successfully — id:", newAnalysis._id);

       return res.status(200).json(newAnalysis);
    }
    catch(e){
        console.error("─── analyzeResume CRASH ───");
        console.error("Message :", e.message);
        console.error("Stack   :", e.stack);
        console.error("──────────────────────────");
        return res.status(500).json({ message: "Error analyzing resume", error: e.message });
    }
}

// Add this to your analysisController.js
export const getHistory = async (req, res) => {
    try {
        // req.userId is securely provided by your protectRoute middleware
        const history = await Analysis.find({ userId: req.userId }).sort({ createdAt: -1 });
        
        // Send the array of past analyses back to the React frontend
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch history: ${error.message}` });
    }
};


export {analyzeResume}
