import jwt from "jsonwebtoken"
import httpStatus from "http-status"


export const protectRoute  = (req,res,next)=>{
    try{
        const token  = req.cookies.token;
        if(!token){
        return res.status(httpStatus.UNAUTHORIZED).json({message:"Invalid or expired token"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)    //verification takes token and secretkey as a parametr
        // if(!decoded){
        // return res.status(httpStatus.UNAUTHORIZED).json({message:"Invalid or expired token"});
            
        // }  this is not valid because jwt verify  is a strict function. If the token is invalid, tampered with, or expired, it does not return null or false—it throws an error instantly and reached to catch state
        req.userId = decoded.userId
        next();

    }
    catch(e){
        return res.status(httpStatus.UNAUTHORIZED).json({message:"Invalid or expired token"})
    }

}