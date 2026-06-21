import cloudinary from "../config/cloudinary.js"
import fs from "fs"
// Grab the specific class out of the new v2 package
import { PDFParse } from "pdf-parse";
import { Resume } from "../models/resumeModel.js"

const uploadResumeToCloudinary = async(req,res)=>{
    if(!req.file){
       return  res.status(400).json({message:"No files uploaded"})
    }
    try{
        const uploadResume = await cloudinary.uploader.upload(req.file.path,{resource_type:"raw"})
        if(!uploadResume)return res.status(500).json({message:"Error uplaoding file. Try again"})
        
        //parsing from local file
        

        //  Read the local file and parse the text BEFORE we delete it!
        const dataBuffer = fs.readFileSync(req.file.path);
        const parser = new PDFParse({ data: dataBuffer });
        const parsedData = await parser.getText()

        // pdf-parse returns an object. The actual words are inside the .text property
        const extractedText = parsedData.text;
        // 3. Clean up the memory (good practice for v2!)
        await parser.destroy();


        const newResume = new Resume({
            userId:req.userId,
            fileName: req.file.originalname,
            fileUrl:uploadResume.secure_url,
            parsedText:parsedData.text

        })
        await newResume.save();
        
        fs.unlinkSync(req.file.path);
        
        // Return success to the frontend
        return res.status(201).json({ 
            message: "Resume uploaded and parsed successfully",
            resumeId: newResume._id,
            // We can send a little preview of the text back just to prove it worked!
            textPreview: extractedText.substring(0, 100) + "..." 
        });


    }
    catch(e){
        // THE FAIL-SAFE: Burn the local file on FAILURE so your server doesn't crash over time
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
       return res.status(500).json({ message: `Error uploading file: ${e.message}` });
    }
}
export {uploadResumeToCloudinary}