import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await axios.post("/auth/register", { username, email, password })
            const userRes = await axios.get("/auth/me")
            setUser(userRes.data)
            navigate("/")
        } catch (e) {
            setError(e.response?.data?.message || "An error occured during registraytion")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F9F9F6] flex font-sans">

            {/* ══════════════════════════════════════
                LEFT PANEL — Form
            ══════════════════════════════════════ */}
            <div className="w-full lg:w-1/2 flex flex-col px-8 sm:px-14 lg:px-20 py-16 justify-center">

                {/* Brand mark */}
                <div className="mb-12">
                    <span className="font-mono text-base font-bold tracking-tight text-[#1A1A1A]">Path<span className="text-[#6B8F71]">AI</span></span>
                </div>

                {/* Heading */}
                <div className="mb-10">
                    <h1 className="font-serif text-5xl lg:text-[3.75rem] font-bold text-[#1A1A1A] leading-[1.04] mb-4">
                        Begin your<br />journey.
                    </h1>
                    <p className="text-[#8A8A82] text-sm leading-relaxed">
                        Create your account to start<br />analyzing your career path.
                    </p>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="mb-6 px-4 py-3 border-l-4 border-[#C4704F] bg-[#C4704F]/[0.06] text-[#C4704F] text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Name */}
                    <div>
                        <label className="block text-[10px] font-semibold tracking-[0.28em] uppercase text-[#8A8A82] mb-3">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-transparent border-0 border-b-[1.5px] border-[#C8C8C0] pb-3 text-[#1A1A1A] text-base placeholder:text-[#C8C8C0] focus:outline-none focus:border-b-2 focus:border-[#1A1A1A] transition-all duration-200"
                            placeholder="Jane Doe"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-[10px] font-semibold tracking-[0.28em] uppercase text-[#8A8A82] mb-3">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-0 border-b-[1.5px] border-[#C8C8C0] pb-3 text-[#1A1A1A] text-base placeholder:text-[#C8C8C0] focus:outline-none focus:border-b-2 focus:border-[#1A1A1A] transition-all duration-200"
                            placeholder="you@company.com"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[10px] font-semibold tracking-[0.28em] uppercase text-[#8A8A82] mb-3">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-0 border-b-[1.5px] border-[#C8C8C0] pb-3 text-[#1A1A1A] text-base placeholder:text-[#C8C8C0] focus:outline-none focus:border-b-2 focus:border-[#1A1A1A] transition-all duration-200"
                            placeholder="Min. 6 characters"
                            required
                            minLength={6}
                        />
                    </div>

                    {/* Submit */}
                    <div className="pt-1">
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full py-4 bg-[#1A1A1A] text-[#F9F9F6]
                                text-xs font-semibold tracking-[0.18em] uppercase
                                border border-[#1A1A1A]
                                shadow-[4px_4px_0px_0px_#6B8F71]
                                hover:shadow-[2px_2px_0px_0px_#6B8F71] hover:translate-x-[2px] hover:translate-y-[2px]
                                active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
                                transition-all duration-100
                                disabled:opacity-40 disabled:cursor-not-allowed
                                disabled:translate-x-0 disabled:translate-y-0
                                disabled:shadow-[4px_4px_0px_0px_#6B8F71]
                            "
                        >
                            {loading ? "Creating Account..." : "Create Account →"}
                        </button>
                    </div>
                </form>

                {/* Footer link */}
                <p className="mt-10 text-sm text-[#8A8A82]">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-[#1A1A1A] font-semibold underline underline-offset-4 decoration-[#6B8F71] hover:text-[#6B8F71] transition-colors duration-150"
                    >
                        Sign in →
                    </Link>
                </p>
            </div>

            {/* ══════════════════════════════════════
                RIGHT PANEL — Decorative (Stats)
            ══════════════════════════════════════ */}
            <div className="hidden lg:flex w-1/2 bg-[#1A1A1A] flex-col justify-between p-16 relative overflow-hidden">

                {/* Subtle editorial grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #F9F9F6 1px, transparent 1px),
                            linear-gradient(to bottom, #F9F9F6 1px, transparent 1px)
                        `,
                        backgroundSize: "52px 52px",
                    }}
                />

                {/* Top accent mark */}
                <div className="relative z-10 flex items-start justify-between">
                    <div className="w-8 h-8 border border-[#6B8F71]" />
                    <span className="text-[10px] tracking-[0.35em] uppercase text-[#3D3D38] font-medium">
                        v1.0
                    </span>
                </div>

                {/* Editorial stat blocks */}
                <div className="relative z-10">
                    <div className="h-px w-10 bg-[#6B8F71] mb-10" />
                    <p className="text-[10px] tracking-[0.32em] uppercase text-[#5A5A52] font-medium mb-8">
                        What you unlock
                    </p>
                    <div className="space-y-0 divide-y divide-[#2A2A24]">
                        {[
                            { number: "72%", label: "Average match score improvement after one analysis" },
                            { number: "~10s", label: "Gemini AI turnaround time per full report" },
                            { number: "5–10", label: "Personalised interview questions per resume" },
                        ].map((stat) => (
                            <div key={stat.label} className="py-7 flex items-start gap-6">
                                <p className="font-serif text-3xl font-bold text-[#F9F9F6] shrink-0 w-20">
                                    {stat.number}
                                </p>
                                <p className="text-sm text-[#5A5A52] leading-relaxed font-medium pt-1">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom dot row */}
                <div className="relative z-10 flex gap-2 items-center">
                    <div className="w-1.5 h-1.5 bg-[#6B8F71]" />
                    <div className="w-1.5 h-1.5 bg-[#F9F9F6]/20" />
                    <div className="w-1.5 h-1.5 bg-[#F9F9F6]/20" />
                </div>
            </div>
        </div>
    );
}