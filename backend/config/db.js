import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // This connects to the string you put in your .env file
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Exit the Node process with a failure code (1) if the database fails
        process.exit(1); 
    }
};