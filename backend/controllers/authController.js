import { User } from "../models/userModel.js"
import httpStatus from "http-status";
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'


const generateToken = (user, res) => {
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }

    )

    return res.status(200).cookie("token", token, {
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === "production", // Only works on HTTPS in production
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }).json({
        message: "Login Successful",
        user: { email: user.email, name: user.name }
    });


}



const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({ message: "User already exist with this Email. Try SignIn" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name: username,
            email: email,
            password: hashedPassword

        })
        await newUser.save()

        generateToken(newUser, res)

    }
    catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e}` })
    }


}

const login = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.status(httpStatus.NOT_FOUND).json({ message: "No email Found. Please register first" })
    }
    try {
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if (isPasswordCorrect) {
            generateToken(existingUser, res)
        }
        else {
            res.status(httpStatus.UNAUTHORIZED).json({ message: "Wrong Email or Password" })
        }

    }
    catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e}` })

    }
}
const logout = (req, res) => {
    // Parameter 1: The name of the cookie ("token")
    // Parameter 2: The exact options used when creating it (minus maxAge)
    res.clearCookie("token", {
        secure: process.env.NODE_ENV === "production", 
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    return res.status(200).json({ message: "Logged out successfully" });
};

export { register, login, logout }
