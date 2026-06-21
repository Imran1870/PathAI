import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resume } from "../models/resumeModel.js";
import { Analysis } from "../models/analysisModel.js";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

 const analyzeResume = async (req,res)=>{
    const {resumeId,targetRole,jobDescription,currentScenario} = req.body;
   // Guard before destructuring
        if (!currentScenario || typeof currentScenario !== "object") {
            return res.status(400).json({ message: "currentScenario is required" });
        }
        const { goal, year, currentSkills } = currentScenario;
    try{
        const parsedResumeText = await Resume.findById(resumeId).select("parsedText");
        if (!parsedResumeText) { return res.status(404).json({message: "Resume not found"}) }


       const prompt = `
            You are an expert technical recruiter and career coach.
            I will provide a candidate's resume text, their current scenario, and a target job description.
            
            Analyze the resume against the job description.
            
            Candidate's Current Scenario:
            - Year: ${year}
            - Goal: ${goal}
            - Current Skills: ${currentSkills.join(', ')}
            
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
        const model = genAI.getGenerativeModel({
            model:"gemini-2.5-flash",
            generationConfig: {
                // This is the magic line that forces the AI to ONLY return JSON
                responseMimeType: "application/json", 
            }
        })
       const result = await model.generateContent(prompt)
       const aiResponse = result.response.text()  //this is a json string
       const analysisData = JSON.parse(aiResponse)

       
       const newAnalysis = new Analysis({
         userId:req.userId,
         resumeId:resumeId,
         targetRole:targetRole,
         jobDescription:jobDescription,
         currentScenario:currentScenario,
         analysisResult:
         {
            matchScore:analysisData.matchScore,
            missingSkills:analysisData.missingSkills,
            strengths:analysisData.strengths,
            suggestedProjects:analysisData.suggestedProjects,
            roadmap:analysisData.roadmap,
            good_project_questions:analysisData.good_project_questions,




         }
       })
       await newAnalysis.save()
       return res.status(200).json(newAnalysis);
    }
    catch(e){
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