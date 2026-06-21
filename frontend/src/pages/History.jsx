import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function History() {
    const [historyFiles, setHistoryFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // OPTIMIZATION: Store the ID of the specific item being viewed, instead of a global true/false
    const [expandedId, setExpandedId] = useState(null);

    const toggleViewMore = (id) => {
        // If clicking the same item, close it. Otherwise, open the new one.
        setExpandedId(expandedId === id ? null : id);
    };

    useEffect(() => {
        // This runs automatically exactly once when the page loads
        const fetchHistory = async () => {
            try {
                // TODO: We need to make sure this backend route actually exists!
                const res = await axios.get("/analyses/history");
                setHistoryFiles(res.data);
            } catch (err) {
                setError("Failed to load history.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    /* ── Small helper: score colour ── */
    const getScoreStyle = (score) => ({
        color: score >= 70 ? "#6B8F71" : score >= 50 ? "#C8963E" : "#C4704F",
        borderColor: score >= 70 ? "#6B8F71" : score >= 50 ? "#C8963E" : "#C4704F",
    });

    return (
        <div className="min-h-screen bg-[#F9F9F6] font-sans">

            {/* ══════════════════════════════════════
                STICKY NAVIGATION BAR
            ══════════════════════════════════════ */}
            <header className="sticky top-0 z-50 bg-[#F9F9F6] border-b border-[#E5E5E0]">
                <div className="max-w-5xl mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between">
                    <span className="font-mono text-base font-bold tracking-tight text-[#1A1A1A]">Path<span className="text-[#C4704F]">AI</span></span>
                    <Link
                        to="/"
                        className="
                            px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase text-[#1A1A1A]
                            border border-[#D4D4D0]
                            hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F9F9F6]
                            transition-all duration-150
                        "
                    >
                        ← Dashboard
                    </Link>
                </div>
            </header>

            {/* ══════════════════════════════════════
                PAGE TITLE STRIP
            ══════════════════════════════════════ */}
            <div className="border-b border-[#E5E5E0]">
                <div className="max-w-5xl mx-auto px-6 lg:px-10 py-8">
                    <p className="text-[10px] font-semibold tracking-[0.32em] uppercase text-[#8A8A82] mb-2">
                        Career Record
                    </p>
                    <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
                        Analysis History
                    </h1>
                </div>
            </div>

            {/* ══════════════════════════════════════
                CONTENT
            ══════════════════════════════════════ */}
            <main className="max-w-5xl mx-auto px-6 lg:px-10 py-10">

                {/* ── Loading: skeleton rows ── */}
                {loading && (
                    <div className="border border-[#E5E5E0]">
                        {/* Fake header */}
                        <div className="border-b border-[#1A1A1A] bg-[#1A1A1A] px-6 py-3 grid grid-cols-[1fr_140px_80px_32px] gap-4">
                            {["w-20", "w-24", "w-10", "w-4"].map((w, i) => (
                                <div key={i} className={`shimmer-block h-2.5 ${w} opacity-30`} />
                            ))}
                        </div>
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="border-b border-[#E5E5E0] last:border-0 px-6 py-6 grid grid-cols-[1fr_140px_80px_32px] gap-4 items-center"
                            >
                                <div className="space-y-2">
                                    <div className="shimmer-block h-5 w-3/4" />
                                    <div className="shimmer-block h-3 w-12" />
                                </div>
                                <div className="shimmer-block h-4 w-28" />
                                <div className="shimmer-block h-8 w-16" />
                                <div className="shimmer-block h-4 w-4" />
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Error ── */}
                {!loading && error && (
                    <div className="px-5 py-4 border-l-4 border-[#C4704F] bg-[#C4704F]/[0.05] text-[#C4704F] text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* ── Empty state ── */}
                {!loading && !error && historyFiles.length === 0 && (
                    <div className="border border-dashed border-[#D4D4D0] p-20 text-center">
                        <p className="font-serif text-2xl italic text-[#CACAC4] mb-5">
                            No analyses yet.
                        </p>
                        <Link
                            to="/"
                            className="text-sm font-semibold text-[#1A1A1A] underline underline-offset-4 decoration-[#C4704F] hover:text-[#C4704F] transition-colors duration-150"
                        >
                            Go analyze a resume →
                        </Link>
                    </div>
                )}

                {/* ══════════════════════════════════════
                    LEDGER TABLE
                ══════════════════════════════════════ */}
                {!loading && !error && historyFiles.length > 0 && (
                    <div className="border border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]">

                        {/* Table header row */}
                        <div className="bg-[#1A1A1A] border-b border-[#1A1A1A] px-6 py-3 grid grid-cols-[1fr_150px_90px_32px] gap-4 items-center">
                            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#5A5A52]">
                                Target Role
                            </span>
                            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#5A5A52]">
                                Date Analyzed
                            </span>
                            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#5A5A52] text-right">
                                Score
                            </span>
                            <span />
                        </div>

                        {/* Data rows */}
                        <div className="divide-y divide-[#E5E5E0]">
                            {historyFiles.map((item, idx) => (
                                <div key={item._id} className="group">

                                    {/* ── Collapsed row ── */}
                                    <div
                                        onClick={() => toggleViewMore(item._id)}
                                        className="px-6 py-5 grid grid-cols-[1fr_150px_90px_32px] gap-4 items-center cursor-pointer hover:bg-[#F0F0EB] transition-colors duration-150"
                                    >
                                        {/* Role + index */}
                                        <div>
                                            <p className="font-serif text-lg font-bold text-[#1A1A1A] leading-tight">
                                                {item.targetRole}
                                            </p>
                                            <p className="text-[10px] font-medium text-[#ADADAD] mt-0.5 tracking-widest">
                                                #{String(idx + 1).padStart(2, "0")}
                                            </p>
                                        </div>

                                        {/* Date */}
                                        <span className="text-sm text-[#8A8A82] font-medium">
                                            {new Date(item.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>

                                        {/* Score badge */}
                                        <div className="flex justify-end">
                                            <span
                                                className="inline-block px-3 py-1.5 text-sm font-bold border"
                                                style={getScoreStyle(item.analysisResult.matchScore)}
                                            >
                                                {item.analysisResult.matchScore}%
                                            </span>
                                        </div>

                                        {/* Arrow — revealed on group-hover */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-lg leading-none font-semibold text-[#CACAC4] group-hover:text-[#1A1A1A] transition-all duration-200">
                                                {expandedId === item._id ? "↑" : "↓"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ── Expanded details ── */}
                                    {expandedId === item._id && (
                                        <div className="px-6 pt-6 pb-8 bg-[#F0F0EB] border-t border-[#D4D4D0] animate-slide-down">

                                            {/* Three-column print layout */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

                                                {/* Strengths */}
                                                <div>
                                                    <h4 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#8A8A82] mb-3 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-[#6B8F71] shrink-0" />
                                                        Strengths
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {item.analysisResult.strengths.map((strength, i) => (
                                                            <li
                                                                key={i}
                                                                className="text-sm text-[#1A1A1A] leading-snug flex items-start gap-2"
                                                            >
                                                                <span className="text-[#6B8F71] font-bold shrink-0 mt-px">→</span>
                                                                {strength}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Missing Skills */}
                                                <div>
                                                    <h4 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#8A8A82] mb-3 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-[#C4704F] shrink-0" />
                                                        Missing Skills
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.analysisResult.missingSkills.map((skill, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2.5 py-1 text-xs font-semibold border border-[#C4704F] text-[#C4704F] bg-[#C4704F]/[0.05]"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Suggested Projects */}
                                                <div>
                                                    <h4 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#8A8A82] mb-3 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-[#C8963E] shrink-0" />
                                                        Suggested Projects
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {item.analysisResult.suggestedProjects.map((project, i) => (
                                                            <div key={i}>
                                                                <p className="text-sm font-bold text-[#1A1A1A]">
                                                                    {project.title}
                                                                </p>
                                                                <p className="text-xs text-[#6B6B6B] leading-relaxed mt-1">
                                                                    {project.description}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Roadmap — full width at the bottom */}
                                            <div className="border-t border-[#D4D4D0] pt-6">
                                                <h4 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#8A8A82] mb-4 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-[#1A1A1A] shrink-0" />
                                                    Career Roadmap
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {item.analysisResult.roadmap.map((step, i) => (
                                                        <div key={i} className="border-l-2 border-[#1A1A1A] pl-4">
                                                            <p className="font-serif text-sm font-bold text-[#1A1A1A] mb-1 leading-snug">
                                                                {step.phase}
                                                            </p>
                                                            <p className="text-xs text-[#6B6B6B] leading-relaxed">
                                                                {step.description}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Table footer */}
                        <div className="border-t border-[#E5E5E0] px-6 py-3 flex items-center justify-between bg-[#F9F9F6]">
                            <span className="text-[10px] text-[#ADADAD] font-medium tracking-wide">
                                {historyFiles.length} {historyFiles.length === 1 ? "record" : "records"} total
                            </span>
                            <span className="text-[10px] text-[#ADADAD] font-medium tracking-wide">
                                Sorted newest first
                            </span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}