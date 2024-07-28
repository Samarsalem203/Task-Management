import multer from "multer"
import { validExtension } from "../utilts/validExtension.js"

export const myMulter=(customExtension)=>{
  
 
    if(!customExtension){
        customExtension = validExtension.image
    }

    const storage = multer.diskStorage({})
    
    const fileFilter = function (req,file,cb){
     
       if(customExtension.includes(file.mimetype)){

           return cb(null , true)
       }
       
        return cb(new Error(`In-valid data type,Allow only to ${customExtension}`,{cause:400}) , false)
 }

const upload = multer({fileFilter,storage})
if(!upload){
   return  console.log("error");
}
return upload 


}