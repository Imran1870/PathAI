import mongoose from "mongoose";
const {Schema} = mongoose;
const analysisSchema = new Schema({
    userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
    },
    resumeId: { type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
     },
    targetRole:{type:String, required:true},
    jobDescription:{type:String, required:true},
     currentScenario:{
        goal:{type:String},
        year:{type:String},
        currentSkills:{type:[String]},
    },
    analysisResult:{
        matchScore:{type:Number},
        missingSkills:{type:[String]},
        strengths:{type:[String]},
       suggestedProjects: [{ 
        title: { type: String }, 
        description: { type: String } 
    }],
        roadmap:[{
            phase:{type:String},
            description:{type:String},
        }],
        good_project_questions:[{
            question:{type:String},
            answer:{type:String}
        }],
       
    },
   
},{timestamps: true}
)
analysisSchema.index({ userId: 1, createdAt: -1 });

const Analysis  =  mongoose.model('Analysis', analysisSchema);
export {Analysis}
