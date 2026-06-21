import {useState, createContext, useContext, useEffect} from "react"
import axios from "axios"


const AuthContext = createContext()


export const useAuth = ()=>{
    return useContext(AuthContext)
}

export const AuthProvider = ({children})=>{
const [user,setUser] = useState(null)
const [loading,setLoading] = useState(true)
axios.defaults.baseURL = "https://pathai-7fmi.onrender.com" || "http://localhost:5000/api";
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
                <div className="fixed inset-0 bg-[#F9F9F6] flex flex-col">
                    {/* Thin animated progress bar at top */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E8E8E4] overflow-hidden">
                        <div className="h-full w-full bg-[#1A1A1A] animate-progress-bar" />
                    </div>
                    {/* Centered brand lockup */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <p className="font-mono text-2xl font-bold tracking-tight text-[#1A1A1A]">Path<span className="text-[#C4704F]">AI</span></p>
                        <p className="text-[10px] tracking-[0.35em] uppercase text-[#ADADAD] font-medium">
                            Authenticating
                        </p>
                    </div>
                </div>
            ) : (
                children
            )
        }
        </AuthContext.Provider>
    );
};