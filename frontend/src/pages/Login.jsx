import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await axios.post("/auth/login", { email, password })
            const userRes = await axios.get("/auth/me");
            setUser(userRes)
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during login")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#F9F9F6] flex font-sans">

            {/* ══════════════════════════════════════
                LEFT PANEL — Form
            ══════════════════════════════════════ */}
            <div className="w-full lg:w-1/2 flex flex-col px-8 sm:px-14 lg:px-20 py-16 justify-center">

                {/* Brand mark */}
                <div className="mb-16">
                    <span className="font-serif text-lg font-bold italic text-[#1A1A1A]">PathAI</span>
                </div>

                {/* Heading */}
                <div className="mb-10">
                    <h1 className="font-serif text-5xl lg:text-[3.75rem] font-bold text-[#1A1A1A] leading-[1.04] mb-4">
                        Welcome<br />back.
                    </h1>
                    <p className="text-[#8A8A82] text-sm leading-relaxed">
                        Sign in to continue your career<br />analysis journey.
                    </p>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="mb-6 px-4 py-3 border-l-4 border-[#C4704F] bg-[#C4704F]/[0.06] text-[#C4704F] text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-9">

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
                            placeholder="••••••••"
                            required
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
                                shadow-[4px_4px_0px_0px_#C4704F]
                                hover:shadow-[2px_2px_0px_0px_#C4704F] hover:translate-x-[2px] hover:translate-y-[2px]
                                active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
                                transition-all duration-100
                                disabled:opacity-40 disabled:cursor-not-allowed
                                disabled:translate-x-0 disabled:translate-y-0
                                disabled:shadow-[4px_4px_0px_0px_#C4704F]
                            "
                        >
                            {loading ? "Signing in..." : "Sign In →"}
                        </button>
                    </div>
                </form>

                {/* Footer link */}
                <p className="mt-10 text-sm text-[#8A8A82]">
                    No account yet?{" "}
                    <Link
                        to="/register"
                        className="text-[#1A1A1A] font-semibold underline underline-offset-4 decoration-[#C4704F] hover:text-[#C4704F] transition-colors duration-150"
                    >
                        Create one →
                    </Link>
                </p>
            </div>

            {/* ══════════════════════════════════════
                RIGHT PANEL — Decorative
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
                    <div className="w-8 h-8 border border-[#C4704F]" />
                    <span className="text-[10px] tracking-[0.35em] uppercase text-[#3D3D38] font-medium">
                        Est. 2024
                    </span>
                </div>

                {/* Main editorial quote */}
                <div className="relative z-10">
                    <div className="h-px w-10 bg-[#C4704F] mb-10" />
                    <blockquote className="font-serif text-[#F9F9F6] text-4xl xl:text-[2.85rem] font-bold leading-[1.13] mb-10">
                        "Your next<br />opportunity<br />starts with<br />knowing<br />where you<br />stand."
                    </blockquote>
                    <div className="flex items-center gap-4">
                        <div className="w-5 h-px bg-[#C4704F]" />
                        <span className="text-[10px] tracking-[0.32em] uppercase text-[#5A5A52] font-medium">
                            PathAI Career Engine
                        </span>
                    </div>
                </div>

                {/* Bottom dot row */}
                <div className="relative z-10 flex gap-2 items-center">
                    <div className="w-1.5 h-1.5 bg-[#C4704F]" />
                    <div className="w-1.5 h-1.5 bg-[#F9F9F6]/20" />
                    <div className="w-1.5 h-1.5 bg-[#F9F9F6]/20" />
                </div>
            </div>
        </div>
    );
}