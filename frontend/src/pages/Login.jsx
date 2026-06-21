import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx"; // Bring in your global brain! 


export default function Login(){
    const { setUser } = useAuth(); // We need this to tell React the user logged in
    const navigate = useNavigate(); // We need this to redirect them
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


// 2. Hooks

  // 3. The Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // CRITICAL: Stops the browser from refreshing the page
    setError(null);
    setLoading(true);

    try {
      

      await axios.post("/auth/login",{email,password})

      // 2. Since login was successful (cookie is set!), ask the backend who we are
      const userRes = await axios.get("/auth/me");
      setUser(userRes)
      navigate("/");


    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login")
    } finally {
      setLoading(false);
    }}


    // 4. The UI (Tailwind Template)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>

        {/* Dynamic Error Display */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input

              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
  