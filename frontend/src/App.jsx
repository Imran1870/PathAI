import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashhboard.jsx";
import History from "./pages/History.jsx";

export default function App(){
  const {user,loading} = useAuth()
  if(loading){
      return (
          <div className="fixed inset-0 bg-[#F9F9F6] flex flex-col">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E8E8E4] overflow-hidden">
                  <div className="h-full w-full bg-[#1A1A1A] animate-progress-bar" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <p className="font-mono text-2xl font-bold tracking-tight text-[#1A1A1A]">Path<span className="text-[#C4704F]">AI</span></p>
                  <p className="text-[10px] tracking-[0.35em] uppercase text-[#ADADAD] font-medium">
                      Loading
                  </p>
              </div>
          </div>
      );
  }
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/history"
          element={user ? <History /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  )
}