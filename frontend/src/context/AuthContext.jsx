import {useState, createContext, useContext, useEffect} from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom";


const AuthContext = createContext()


export const useAuth = ()=>{
    return useContext(AuthContext)
}

export const AuthProvider = ({children})=>{
const [user,setUser] = useState(null)
const [loading,setLoading] = useState(true)
axios.defaults.baseURL = "http://localhost:5000/api"
axios.defaults.withCredentials = true;



useEffect(()=>{
    const checkedLoggedInUser = async()=>{
            try{
                const res = await axios.get("/auth/me");
                setUser(res.data)
               

    }
    catch(e){
       setUser(null);
    }
    finally {
                setLoading(false); // Done checking, stop the loading spinner
            }
    }
    checkedLoggedInUser();
   
},[])
return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {/* If we are still checking the backend, don't render the app yet */}
            {loading ? (
                <div className="flex items-center justify-center h-screen text-2xl text-gray-500">
                    Loading your profile...
                </div>
            ) : (
                children
            )
        }
        </AuthContext.Provider>
    );
};