    import { useState } from "react";
    import axios, { formToJSON } from "axios";
    import { useAuth } from "../context/AuthContext.jsx";
    import History from "./History.jsx"
    import { Link } from "react-router-dom";
    import { useNavigate } from "react-router-dom";
    export default function Dashboard() {
    const { user, setUser } = useAuth(); // Grab the user to say hello
    const navigate = useNavigate();


    // 1. Form State
    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [year, setYear] = useState("");
    const [goal, setGoal] = useState("");
    const [currentSkills, setCurrentSkills] = useState(""); // We will split this into an array later

    // 2. App State
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(""); // To tell the user what is happening
    const [error, setError] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null); // Holds the final AI JSON

    // 3. The Logout Handler (Bonus feature!)
    const handleLogout = async () => {
        try {
          await axios.post("/auth/logout");
          setUser(null);
          
      } catch (err) {
          console.error("Logout failed:", err);
      }
    }

    const handleHistory = async()=>{
         navigate("/History")
    }

   

    // 4. The Master Submit Handler
    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!file) return setError("Please upload a resume PDF first.");
        
        setError(null);
        setLoading(true);

        try {
        // --- PHASE 1: Upload the PDF ---
        console.log("hello1")
        setLoadingStep("Uploading to Cloudinary and parsing text...");
        console.log("hello1")

        
        // When sending files, we MUST use FormData, not a standard JSON object
        const formData = new FormData();
        formData.append("resume", file);
        

        // TODO 1: Make an axios.post request to your resume upload route. 
        // Example: await axios.post("/resumes/resume", formData, { headers: { "Content-Type": "multipart/form-data" } })
        // Remember to grab the response so you can extract the resumeId!
            
        const uploadRes = await axios.post("/resumes/upload",formData,{headers:{"Content-Type":"multipart/form-data"}})
        console.log(uploadRes)
        
        const resumeId = uploadRes.data.resumeId; // Adjust based on exactly what your backend returns!


        // --- PHASE 2: Trigger the AI ---
        setLoadingStep("AI is analyzing your profile... this takes about 10 seconds.");
        
        // We need to convert the comma-separated skills string into an array for your backend
        const skillsArray = currentSkills.split(",").map(skill => skill.trim());

        const aiPayload = {
            resumeId: resumeId, // TODO 2: Put the ID from Phase 1 here
            targetRole,
            jobDescription,
            currentScenario: {
                year,
                goal,
                currentSkills: skillsArray
            }
        };

        // TODO 3: Make an axios.post request to your AI analyze route.
        // Example: await axios.post("/analyses/analyze", aiPayload)
        const aiRes = await axios.post("/analyses/resume",aiPayload)
        console.log("GEMINI AI RESULT:", aiRes.data)

        // --- PHASE 3: Show the Results ---
        setAnalysisResult(aiRes.data);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "An error occurred during analysis.");
        } finally {
            setLoading(false);
            setLoadingStep("");
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-100">
        
       <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name || user?.email}</h1>
            <p className="text-gray-600">Let's analyze your resume against your dream job.</p>
          </div>
          
          {/* NEW: Wrap the buttons in a flex container */}
          <div className="flex gap-4">
              <button onClick={handleHistory} className="px-4 py-2 font-semibold text-white bg-indigo-500 rounded hover:bg-indigo-600">
                  View History
              </button>
              <button onClick={handleLogout} className="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600">
                  Logout
              </button>
          </div>
      </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* LEFT COLUMN: THE INPUT FORM */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold">1. Provide your Details</h2>
                
                {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}

                <form onSubmit={handleAnalyze} className="space-y-4">
                    {/* File Upload */}
                    <div>
                        <label className="block mb-1 font-medium">Resume (PDF)</label>
                        <input 
                            type="file" 
                            accept="application/pdf"
                            onChange={(e) => setFile(e.target.files[0])} // This is how you grab the file!
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {/* Target Role */}
                    <div>
                        <label className="block mb-1 font-medium">Target Role</label>
                        <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Frontend Developer" className="w-full p-2 border rounded" required />
                    </div>

                    {/* Job Description */}
                    <div>
                        <label className="block mb-1 font-medium">Job Description</label>
                        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the JD here..." className="w-full p-2 border rounded h-32" required />
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block mb-1 font-medium">Current Year/Status</label>
                        <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 3rd Year B.Tech" className="w-full p-2 border rounded" required />
                    </div>

                    {/* Goal */}
                    <div>
                        <label className="block mb-1 font-medium">Primary Goal</label>
                        <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Get a summer internship" className="w-full p-2 border rounded" required />
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block mb-1 font-medium">Current Skills (comma separated)</label>
                        <input type="text" value={currentSkills} onChange={(e) => setCurrentSkills(e.target.value)} placeholder="React, Node.js, Python" className="w-full p-2 border rounded" required />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {loading ? "Processing..." : "Generate AI Analysis"}
                    </button>
                </form>
            </div>

            {/* RIGHT COLUMN: THE AI RESULTS */}
            <div className="p-6 bg-white rounded-lg shadow-md overflow-y-auto max-h-[80vh]">
                <h2 className="mb-4 text-xl font-semibold">2. AI Analysis Results</h2>
                
                {loading && (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        <p className="text-gray-600 animate-pulse">{loadingStep}</p>
                    </div>
                )}

                {!loading && !analysisResult && (
                    <div className="flex items-center justify-center h-64 text-gray-400">
                        Submit your profile on the left to see results here.
                    </div>
                )}

                {/* THE AI DASHBOARD UI */}
             {!loading && analysisResult && (
                 <div className="space-y-6 text-left">
                     
                     {/* 1. Match Score */}
                     <div className="p-6 text-center bg-blue-50 border border-blue-100 rounded-xl">
                         <h3 className="text-lg font-bold text-blue-800 uppercase tracking-wide">Resume Match Score</h3>
                         <div className="mt-2 text-5xl font-extrabold text-blue-600">
                             {analysisResult.analysisResult.matchScore}%
                         </div>
                     </div>

                     {/* 2. Missing Skills */}
                     <div>
                         <h3 className="mb-3 text-lg font-bold text-gray-800 border-b pb-2">⚠️ Missing Skills</h3>
                         <div className="flex flex-wrap gap-2">
                             {analysisResult.analysisResult.missingSkills.map((skill, index) => (
                                 <span key={index} className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                                     {skill}
                                 </span>
                             ))}
                         </div>
                     </div>

                     {/* 3. Your Custom Roadmap */}
                     <div>
                         <h3 className="mb-3 text-lg font-bold text-gray-800 border-b pb-2">🚀 Action Plan & Roadmap</h3>
                         <div className="space-y-4">
                             {analysisResult.analysisResult.roadmap.map((step, index) => (
                                 <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                                     <h4 className="font-bold text-gray-800">{step.phase}</h4>
                                     <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                                 </div>
                             ))}
                         </div>
                     </div>

                     {/* 4. Technical Interview Prep */}
                     <div>
                         <h3 className="mb-3 text-lg font-bold text-gray-800 border-b pb-2">🎯 Anticipated Interview Questions</h3>
                         <div className="space-y-4">
                             {analysisResult.analysisResult.good_project_questions.map((q, index) => (
                                 <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                     <p className="font-semibold text-green-900">Q: {q.question}</p>
                                     <p className="mt-2 text-sm text-green-800"><span className="font-bold">Ideal Answer:</span> {q.answer}</p>
                                 </div>
                             ))}
                         </div>
                     </div>

                 </div>
             )}
            </div>

        </div>
        </div>
    );
    }