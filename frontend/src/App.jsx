import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashhboard.jsx";
import History from "./pages/History.jsx";

export default function App(){
  const {user,loading} = useAuth()
  
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} /> 
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />}/>
        <Route path="/history"element = {user?<History/> : <Navigate to = "/login"/>} />
       
      </Routes>
    </Router>
  )
}