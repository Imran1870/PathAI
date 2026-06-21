import { useState } from "react";
import axios, { formToJSON } from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import History from "./History.jsx"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────────────
   SKELETON LOADER
   Mimics the exact shape of the bento results grid while AI works.
───────────────────────────────────────────────────────────────────── */
function SkeletonLoader() {
    return (
        <div className="space-y-4">
            {/* Match Score block */}
            <div className="border border-[#D4D4D0] p-8 flex items-end gap-8">
                <div className="space-y-3">
                    <div className="shimmer-block h-3 w-32" />
                    <div className="shimmer-block h-24 w-48" />
                </div>
                <div className="flex-1 space-y-2 pb-1">
                    <div className="shimmer-block h-3 w-24 ml-auto" />
                    <div className="shimmer-block h-6 w-20 ml-auto" />
                </div>
            </div>

            {/* Missing Skills + Strengths row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#D4D4D0] p-5 space-y-3">
                    <div className="shimmer-block h-3 w-24" />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {[72, 56, 88, 64].map((w) => (
                            <div key={w} className={`shimmer-block h-7`} style={{ width: `${w}px` }} />
                        ))}
                    </div>
                </div>
                <div className="border border-[#D4D4D0] p-5 space-y-3">
                    <div className="shimmer-block h-3 w-20" />
                    {[100, 90, 75].map((w, i) => (
                        <div key={i} className="shimmer-block h-4" style={{ width: `${w}%` }} />
                    ))}
                </div>
            </div>

            {/* Roadmap block */}
            <div className="border border-[#D4D4D0] p-5 space-y-4">
                <div className="shimmer-block h-3 w-36" />
                {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-4">
                        <div className="shimmer-block w-6 h-6 shrink-0" />
                        <div className="flex-1 space-y-2 pt-0.5">
                            <div className="shimmer-block h-4 w-1/2" />
                            <div className="shimmer-block h-3 w-full" />
                            <div className="shimmer-block h-3 w-5/6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Interview Q&A block */}
            <div className="border border-[#D4D4D0] p-5 space-y-4">
                <div className="shimmer-block h-3 w-48" />
                {[0, 1, 2].map((i) => (
                    <div key={i} className="pt-4 border-t border-[#E8E8E4] first:border-0 first:pt-0 space-y-2">
                        <div className="shimmer-block h-4 w-full" />
                        <div className="shimmer-block h-4 w-3/4" />
                        <div className="shimmer-block h-3 w-5/6 mt-2" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────────────────────────────── */
export default function Dashboard() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    // 1. Form State
    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [year, setYear] = useState("");
    const [goal, setGoal] = useState("");
    const [currentSkills, setCurrentSkills] = useState("");

    // 2. App State
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState("");
    const [error, setError] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);

    // 3. The Logout Handler (Bonus feature!)
    const handleLogout = async () => {
        try {
            await axios.post("/auth/logout");
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }

    const handleHistory = async () => {
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

            const formData = new FormData();
            formData.append("resume", file);

            const uploadRes = await axios.post("/resumes/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })
            console.log(uploadRes)

            const resumeId = uploadRes.data.resumeId;

            // --- PHASE 2: Trigger the AI ---
            setLoadingStep("AI is analyzing your profile... this takes about 10 seconds.");

            const skillsArray = currentSkills.split(",").map(skill => skill.trim());

            const aiPayload = {
                resumeId: resumeId,
                targetRole,
                jobDescription,
                currentScenario: {
                    year,
                    goal,
                    currentSkills: skillsArray
                }
            };

            const aiRes = await axios.post("/analyses/resume", aiPayload)
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

    // Derived display values (computed from existing state — no new state)
    const score = analysisResult?.analysisResult?.matchScore;
    const scoreColor = score >= 70 ? "#6B8F71" : score >= 50 ? "#C8963E" : "#C4704F";
    const scoreBg   = score >= 70 ? "#6B8F71" : score >= 50 ? "#C8963E" : "#C4704F";
    const scoreLabel = score >= 70 ? "Strong Match" : score >= 50 ? "Good Foundation" : "Needs Work";

    return (
        <div className="min-h-screen bg-[#F9F9F6] font-sans">

            {/* ══════════════════════════════════════
                STICKY NAVIGATION BAR
            ══════════════════════════════════════ */}
            <header className="sticky top-0 z-50 bg-[#F9F9F6] border-b border-[#E5E5E0]">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <span className="font-mono text-base font-bold tracking-tight text-[#1A1A1A]">Path<span className="text-[#C4704F]">AI</span></span>
                        <div className="hidden sm:block h-4 w-px bg-[#D4D4D0]" />
                        <span className="hidden sm:block text-sm text-[#8A8A82] font-medium truncate max-w-[180px]">
                            {user?.name || user?.email}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleHistory}
                            className="
                                px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase text-[#1A1A1A]
                                border border-[#D4D4D0]
                                hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F9F9F6]
                                transition-all duration-150
                            "
                        >
                            History
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase text-[#8A8A82] hover:text-[#C4704F] transition-colors duration-150"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* ══════════════════════════════════════
                PAGE TITLE STRIP
            ══════════════════════════════════════ */}
            <div className="border-b border-[#E5E5E0]">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
                    <p className="text-[10px] font-semibold tracking-[0.32em] uppercase text-[#8A8A82] mb-2">
                        Career Intelligence
                    </p>
                    <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight">
                        Resume Analyzer
                    </h1>
                </div>
            </div>

            {/* ══════════════════════════════════════
                MAIN CONTENT GRID
            ══════════════════════════════════════ */}
            <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr] gap-8 items-start">

                    {/* ──────────────────────────────────
                        LEFT — Input Form Panel
                    ────────────────────────────────── */}
                    <div className="border border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] bg-[#F9F9F6]">

                        {/* Panel header */}
                        <div className="border-b border-[#E5E5E0] px-6 py-4 flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#C4704F] shrink-0" />
                            <h2 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#1A1A1A]">
                                Your Profile
                            </h2>
                        </div>

                        <form onSubmit={handleAnalyze} className="p-6 space-y-6">

                            {/* Error banner */}
                            {error && (
                                <div className="px-4 py-3 border-l-4 border-[#C4704F] bg-[#C4704F]/[0.06] text-[#C4704F] text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            {/* ── File Dropzone ── */}
                            <div>
                                <label className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8A8A82] mb-2">
                                    Resume (PDF)
                                </label>
                                <label
                                    htmlFor="resume-upload"
                                    className={`
                                        group relative flex flex-col items-center justify-center w-full h-[130px]
                                        border-2 border-dashed cursor-pointer transition-all duration-200
                                        ${file
                                            ? "border-[#6B8F71] bg-[#6B8F71]/[0.04]"
                                            : "border-[#C8C8C0] hover:border-[#1A1A1A] hover:bg-[#1A1A1A]/[0.02]"
                                        }
                                    `}
                                >
                                    <div className="text-center pointer-events-none select-none px-4">
                                        {file ? (
                                            <>
                                                <p className="text-2xl text-[#6B8F71] mb-1.5">✓</p>
                                                <p className="text-sm font-semibold text-[#6B8F71] truncate max-w-[260px]">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-[#8A8A82] mt-1">Click to replace</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-2xl text-[#C8C8C0] group-hover:text-[#1A1A1A] transition-colors duration-200 mb-1.5">
                                                    ↑
                                                </p>
                                                <p className="text-sm font-semibold text-[#8A8A82] group-hover:text-[#1A1A1A] transition-colors duration-200">
                                                    Drop your PDF here
                                                </p>
                                                <p className="text-xs text-[#ADADAD] mt-1">
                                                    or click to browse · max 5 MB
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        id="resume-upload"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="sr-only"
                                    />
                                </label>
                            </div>

                            {/* ── Target Role ── */}
                            <div>
                                <label className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8A8A82] mb-2">
                                    Target Role
                                </label>
                                <input
                                    type="text"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    placeholder="e.g. Frontend Developer"
                                    className="w-full bg-transparent border border-[#C8C8C0] px-4 py-3 text-[#1A1A1A] text-sm placeholder:text-[#C8C8C0] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200"
                                    required
                                />
                            </div>

                            {/* ── Job Description ── */}
                            <div>
                                <label className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8A8A82] mb-2">
                                    Job Description
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the full job description here..."
                                    className="w-full bg-transparent border border-[#C8C8C0] px-4 py-3 text-[#1A1A1A] text-sm placeholder:text-[#C8C8C0] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200 h-[110px] resize-none"
                                    required
                                />
                            </div>

                            {/* ── Year + Goal (side by side) ── */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8A8A82] mb-2">
                                        Year / Status
                                    </label>
                                    <input
                                        type="text"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        placeholder="3rd Year B.Tech"
                                        className="w-full bg-transparent border border-[#C8C8C0] px-3 py-3 text-[#1A1A1A] text-sm placeholder:text-[#C8C8C0] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8A8A82] mb-2">
                                        Primary Goal
                                    </label>
                                    <input
                                        type="text"
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        placeholder="Get an internship"
                                        className="w-full bg-transparent border border-[#C8C8C0] px-3 py-3 text-[#1A1A1A] text-sm placeholder:text-[#C8C8C0] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            {/* ── Skills ── */}
                            <div>
                                <label className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8A8A82] mb-2">
                                    Current Skills{" "}
                                    <span className="normal-case font-normal tracking-normal text-[#ADADAD]">
                                        (comma separated)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={currentSkills}
                                    onChange={(e) => setCurrentSkills(e.target.value)}
                                    placeholder="React, Node.js, Python..."
                                    className="w-full bg-transparent border border-[#C8C8C0] px-4 py-3 text-[#1A1A1A] text-sm placeholder:text-[#C8C8C0] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-200"
                                    required
                                />
                            </div>

                            {/* ── Submit ── */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    w-full py-4 bg-[#1A1A1A] text-[#F9F9F6]
                                    text-xs font-semibold tracking-[0.18em] uppercase
                                    border border-[#1A1A1A]
                                    shadow-[3px_3px_0px_0px_#C4704F]
                                    hover:shadow-[1px_1px_0px_0px_#C4704F] hover:translate-x-[2px] hover:translate-y-[2px]
                                    active:shadow-none active:translate-x-[3px] active:translate-y-[3px]
                                    transition-all duration-100
                                    disabled:opacity-40 disabled:cursor-not-allowed
                                    disabled:translate-x-0 disabled:translate-y-0
                                    disabled:shadow-[3px_3px_0px_0px_#C4704F]
                                "
                            >
                                {loading
                                    ? (loadingStep || "Processing...")
                                    : "Generate AI Analysis →"}
                            </button>
                        </form>
                    </div>

                    {/* ──────────────────────────────────
                        RIGHT — Results Panel
                    ────────────────────────────────── */}
                    <div>

                        {/* Skeleton loader */}
                        {loading && <SkeletonLoader />}

                        {/* Empty state */}
                        {!loading && !analysisResult && (
                            <div className="border border-dashed border-[#D4D4D0] min-h-[560px] flex flex-col items-center justify-center text-center p-12">
                                <div className="w-14 h-14 border border-[#D4D4D0] flex items-center justify-center mb-6">
                                    <span className="text-[#CACAC4] text-2xl">✦</span>
                                </div>
                                <p className="font-serif text-2xl text-[#C8C8C0] italic mb-2">
                                    Your analysis will appear here.
                                </p>
                                <p className="text-[10px] tracking-[0.28em] uppercase text-[#C8C8C0] font-semibold mt-2">
                                    Fill the form and hit generate
                                </p>
                            </div>
                        )}

                        {/* ══ AI RESULTS — BENTO GRID ══ */}
                        {!loading && analysisResult && (
                            <div className="space-y-4">

                                {/* ── Block 1: Match Score (editorial hero) ── */}
                                <div className="border border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] bg-[#1A1A1A] px-8 pt-8 pb-7 flex items-end justify-between gap-6">
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-[0.32em] uppercase text-[#5A5A52] mb-3">
                                            Resume Match Score
                                        </p>
                                        {/* Giant editorial number */}
                                        <p
                                            className="font-serif font-black leading-none"
                                            style={{ fontSize: "clamp(5rem, 11vw, 8.5rem)", color: scoreBg }}
                                        >
                                            {score}%
                                        </p>
                                    </div>
                                    <div className="text-right pb-2 shrink-0">
                                        <span
                                            className="inline-block px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase border"
                                            style={{ borderColor: scoreColor, color: scoreColor }}
                                        >
                                            {scoreLabel}
                                        </span>
                                    </div>
                                </div>

                                {/* ── Block 2: Skills Row ── */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Missing Skills */}
                                    <div className="border border-[#1A1A1A] shadow-[4px_4px_0px_0px_#C4704F] p-6">
                                        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8A8A82] mb-4 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#C4704F] shrink-0" />
                                            Missing Skills
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.analysisResult.missingSkills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2.5 py-1 text-xs font-semibold border border-[#C4704F] text-[#C4704F] bg-[#C4704F]/[0.05]"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Strengths */}
                                    <div className="border border-[#1A1A1A] shadow-[4px_4px_0px_0px_#6B8F71] p-6">
                                        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8A8A82] mb-4 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#6B8F71] shrink-0" />
                                            Key Strengths
                                        </p>
                                        <ul className="space-y-2">
                                            {analysisResult.analysisResult.strengths.map((strength, index) => (
                                                <li key={index} className="text-sm text-[#1A1A1A] leading-snug flex items-start gap-2">
                                                    <span className="text-[#6B8F71] shrink-0 mt-px font-bold">→</span>
                                                    {strength}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* ── Block 3: Roadmap ── */}
                                <div className="border border-[#1A1A1A] shadow-[4px_4px_0px_0px_#C8963E] p-6">
                                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8A8A82] mb-6 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#C8963E] shrink-0" />
                                        Action Plan &amp; Roadmap
                                    </p>
                                    <div className="space-y-0">
                                        {analysisResult.analysisResult.roadmap.map((step, index) => (
                                            <div key={index} className="flex gap-5">
                                                {/* Step connector */}
                                                <div className="flex flex-col items-center shrink-0">
                                                    <div className="w-7 h-7 border-2 border-[#1A1A1A] flex items-center justify-center bg-[#F9F9F6] shrink-0">
                                                        <span className="text-[10px] font-bold text-[#1A1A1A]">{index + 1}</span>
                                                    </div>
                                                    {index < analysisResult.analysisResult.roadmap.length - 1 && (
                                                        <div className="w-px flex-1 bg-[#D4D4D0] my-1" />
                                                    )}
                                                </div>
                                                {/* Step content */}
                                                <div className="pb-6">
                                                    <h4 className="font-serif text-base font-bold text-[#1A1A1A] mb-1 leading-tight">
                                                        {step.phase}
                                                    </h4>
                                                    <p className="text-sm text-[#6B6B6B] leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ── Block 4: Interview Questions ── */}
                                <div className="border border-[#1A1A1A] p-6">
                                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8A8A82] mb-6 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#1A1A1A] shrink-0" />
                                        Anticipated Interview Questions
                                    </p>
                                    <div className="divide-y divide-[#E5E5E0]">
                                        {analysisResult.analysisResult.good_project_questions.map((q, index) => (
                                            <div key={index} className="py-5 first:pt-0 last:pb-0">
                                                <p className="font-semibold text-sm text-[#1A1A1A] leading-snug mb-3">
                                                    <span className="font-serif italic text-[#ADADAD] mr-1.5">
                                                        Q{index + 1}.
                                                    </span>
                                                    {q.question}
                                                </p>
                                                <div className="pl-4 border-l-2 border-[#6B8F71]">
                                                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6B8F71] mb-1.5">
                                                        Ideal Answer
                                                    </p>
                                                    <p className="text-sm text-[#6B6B6B] leading-relaxed">
                                                        {q.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}