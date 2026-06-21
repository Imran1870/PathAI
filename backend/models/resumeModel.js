import mongoose from 'mongoose';
const { Schema } = mongoose;

const resumeSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

     },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    parsedText: { type: String, required: true },
    
},{ timestamps: true }
)
const Resume = mongoose.model('Resume', resumeSchema);
export { Resume }