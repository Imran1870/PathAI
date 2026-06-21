import cloudinary from "../config/cloudinary.js"
import fs from "fs"
// Grab the specific class out of the new v2 package
import { PDFParse } from "pdf-parse";
import { Resume } from "../models/resumeModel.js"

const uploadResumeToCloudinary = async(req,res)=>{
    if(!req.file){
       return  res.status(400).json({message:"No files uploaded"})
    }
    let cloudinaryPublicId = null;

    try{
        const uploadResult = await cloudinary.uploader.upload(req.file.path,{resource_type:"raw"})
        if(!uploadResult)return res.status(500).json({message:"Error uploading file. Try again"})
        cloudinaryPublicId = uploadResult.public_id;
        console.log("Cloudinary upload success:", cloudinaryPublicId)
        
        //parsing from local file
        

        //  Read the local file and parse the text BEFORE we delete it!
        const dataBuffer = fs.readFileSync(req.file.path);
            console.log("Hellna")

        const parser = new PDFParse({ data: dataBuffer });
            console.log("Hellna")

        const parsedData = await parser.getText()
            console.log("Hellna")


        // pdf-parse returns an object. The actual words are inside the .text property
        const extractedText = parsedData.text;
            console.log("Hellna")

        // 3. Clean up the memory (good practice for v2!)
        await parser.destroy();
            console.log("Hellna")



        const newResume = new Resume({
            userId: req.userId,
            fileName: req.file.originalname,
            fileUrl: uploadResult.secure_url,
            parsedText: parsedData.text
        })
        console.log("Resume model created")

        await newResume.save();
            console.log("Hellna")

        
        fs.unlinkSync(req.file.path);
            console.log("Hellna")

        
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
            await fs.unlinkSync(req.file.path);
        }
        // Rollback Cloudinary upload if DB save failed
        if (cloudinaryPublicId) {
            await cloudinary.uploader.destroy(cloudinaryPublicId, { resource_type: "raw" })
                .catch(err => console.error("Cloudinary rollback failed:", err));
        }
       return res.status(500).json({ message: `Error uploading file: ${e.message}` });
    }
}
export {uploadResumeToCloudinary}