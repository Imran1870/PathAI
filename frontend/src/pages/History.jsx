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





    return (
        <div className="min-h-screen p-8 bg-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800">Your Analysis History</h1>
                <Link to="/" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div className="max-w-5xl mx-auto">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>
                ) : historyFiles.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-lg shadow-sm">
                        <p className="text-xl text-gray-500">You haven't analyzed any resumes yet!</p>
                        <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">Go analyze one now</Link>
                    </div>
                ) : (
                    // Changed to a 1-column layout because expanded details need a lot of horizontal room
                    <div className="grid grid-cols-1 gap-6">

                        {historyFiles.map((item) => (
                            <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-indigo-500 transition-all">

                                {/* Card Header (Always Visible) */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800">{item.targetRole}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Analyzed on {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-4 py-2 text-lg font-bold text-blue-800 bg-blue-100 rounded-full">
                                                {item.analysisResult.matchScore}% Match
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            onClick={() => toggleViewMore(item._id)}
                                            className="font-semibold text-indigo-600 hover:text-indigo-800 focus:outline-none flex items-center gap-1"
                                        >
                                            {expandedId === item._id ? "▼ Hide Details" : "▶ View Detailed Analysis"}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Details Section (Only visible if clicked) */}
                                {expandedId === item._id && (
                                    <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-8 animate-fade-in-down">

                                        {/* Strengths */}
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800 mb-3 border-b pb-1">💪 Key Strengths</h4>
                                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                                {item.analysisResult.strengths.map((strength, i) => (
                                                    <li key={i}>{strength}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Missing Skills */}
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800 mb-3 border-b pb-1">⚠️ Missing Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {item.analysisResult.missingSkills.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Suggested Projects */}
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800 mb-3 border-b pb-1">🛠️ Suggested Projects</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {item.analysisResult.suggestedProjects.map((project, i) => (
                                                    <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                                        <h5 className="font-bold text-indigo-700">{project.title}</h5>
                                                        <p className="mt-2 text-sm text-gray-600">{project.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Roadmap */}
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800 mb-3 border-b pb-1">🗺️ Career Roadmap</h4>
                                            <div className="space-y-4">
                                                {item.analysisResult.roadmap.map((step, i) => (
                                                    <div key={i} className="pl-4 border-l-4 border-indigo-500">
                                                        <h5 className="font-bold text-gray-800">{step.phase}</h5>
                                                        <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}