import jwt from "jsonwebtoken"
import { mail } from "../services/mail.js"




export const mailConfirmation = async(req,res,next)=>{
    const email = req.body.email
    
const token = jwt.sign({email},process.env.TOKEN_SIGNATURE,{expiresIn:60*2})  
 const link = `${req.protocol}://${req.headers.host}/user/confirm/${token}`
  
// Refresh the token if it expired
const rfToken = jwt.sign({email},process.env.TOKEN_SIGNATURE)
const reLink = `${req.protocol}://${req.headers.host}/user/reconfirm/${rfToken}`

const sender = mail({
  to:email,
  html:`<a href=${link}>Click here to activate your email</a>
  <br> 
  <br>
  <p>If you cannot activate your email,try the link below: </p>
  <a href=${reLink}> Activate email </a>`
})

if(!sender){

 next(new Error("Failed to send email", { cause: 500 }));  
}

}