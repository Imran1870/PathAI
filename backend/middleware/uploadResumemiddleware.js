import multer from "multer";
import path from "path"


const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"./tmp")
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
})

// 2. Create the file filter to only accept PDFs

const fileFilter = (req,file,cb)=>{
    if(file.mimetype == "application/pdf"){
        cb(null,true)  //accept file
    }
    else {
        cb(new Error("Unsupported file format. Only PDFs are allowed."),false)
    }
}

export const upload = multer({
    storage:storage,
    limits:{fileSize: 5 * 1024 *1024},
    fileFilter:fileFilter

})