import { userModel } from "../../../DB/models/user.js";
import bcrypt from "bcrypt";
import { catchError } from "../../utilts/catchError.js";
import jwt from "jsonwebtoken";
import { mail } from "../../services/mail.js";
import { mailConfirmation } from "../../utilts/mailConfirmation.js";
import {nanoid} from "nanoid"
import cloudinary from "../../utilts/cloudinary.js";
import { pagenate } from "../../services/pagenation.js";


// ************Add a new user or signup***********************************
export const newUser = catchError(async (req, res, next) => {
  const { firstName, lastName, email, password, cPassword, phone, role } =
    req.body;
  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    return next(new Error("Email is exist,please try another one",{cause:400}));
  }
  if(!req.file){
    return next(new Error("Image is required",{cause:400}));

  }
  if (password !== cPassword) {
    return next(new Error("Password does not match",{cause:400}));
  }
 
  //upload user image 
  const customID = nanoid(5)
  const{secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
    folder:`TaskManagement/Users/profileImg/${customID}`
  })


//==== To confirm email =========
mailConfirmation(req,res,next)

//create new user
  const hashPass = bcrypt.hashSync(password, +process.env.SALT_ROUND);
  const user = await  userModel.create({
    firstName,
    lastName,
    email,
    password:hashPass,
    phone,
    role,
    image:{secure_url,public_id},
    customID
  });

  // create new field (userName) and assign first name & last name to it  
  await userModel.aggregate([
    { $project: { userName: { $concat: ["$firstName", " ", "$lastName"] } } },
    { $merge: "users" },
  ]);

// if the user account not created delete image from cloud host & return error
  if(!user){
    await cloudinary.uploader.destroy(public_id)
  return next(new Error("Failed",{cause:400}));
  }
 return res.status(201).json({ message: "Done", user }) 
});

// ************Confirm email*****************
export const confirmEmail = catchError(async(req,res,next)=>{
  const {token} = req.params

  const decoded = jwt.verify(token,process.env.TOKEN_SIGNATURE)
  if(!decoded?.email){
    return next(new Error("Invalid token"))
  }
  const user = await userModel.findOneAndUpdate({email:decoded.email , confirmEmail:false},{confirmEmail:true})
  user ? res.status(200).json({msg:"Confirmed"}):next(new Error("Can't confirm your email or this account already confirmed"))
})

// ************** Re-confirm email (if first link expired)*****************
export const reConfirm = catchError(async(req,res,next)=>{

     const decoded = jwt.verify(req.params.rfToken, process.env.TOKEN_SIGNATURE)

  if(!decoded?.email){
    return next(new Error("Token not provided" , {cause:400}))
  }
  const token= jwt.sign({email:decoded.email},process.env.TOKEN_SIGNATURE,{expiresIn:60*2})
  const link = `${req.protocol}://${req.headers.host}/user/confirm/${token}`
 

  const sender=mail({
    to:decoded.email,
    html:`<a href=${link}>Click here to activate your email</a>`
  })
  sender
    ? res.status(200).json({ msg: "The link has been sent." })
    : next(new Error("Failed to send email", { cause: 500 }));

 
})

//*********** Forgot Password(send OTP code)*****************
export const forgotPass = catchError(async(req,res,next)=>{
  const {email} = req.body
  const emailExist= await userModel.findOne({email ,confirmEmail:true})
  if(!emailExist){
    return next(new Error("Invalid email"))
  }
  const link = `${req.protocol}://${req.headers.host}/user/resetPass`
const code = nanoid(4)
const sendEmail = mail({
  to:email,
  subject:"Reset Password",
  html:`<h3>Reset code: ${code}</h3> <br> <a href=${link}>Reset password</a>`
})
if(!sendEmail){
  return next(new Error("Cannot send reset code"))
}
const user = await userModel.updateOne({email} , {code},{new:true})

if (user.modifiedCount > 0) {
  return res.status(200).json("Code sent ");
}
return next(new Error("Failed", { cause: 400 }));
})

// ************* Reset Password*********************
export const resetPass = catchError(async(req,res,next)=>{
  const{email,code , newPassword,rePassword} = req.body
const userExist = await userModel.findOne({email,code})
if(!userExist){
  return next(new Error("Invalid user"))
}
if(newPassword !== rePassword){
  return next(new Error("Password not matching"))
}
const hashPass = bcrypt.hashSync(newPassword,+process.env.SALT_ROUND)

const updateUser = await userModel.updateOne({email},{password:hashPass , code:"",passChangedAt: new Date()})
if (updateUser.modifiedCount > 0) {
  return res.status(200).json("Password changed ");
}
return next(new Error("Change password failed", { cause: 400 }));
})

// *********** Change Password*********************
export const changePass= catchError(async(req,res,next)=>{
  const {oldPassword , newPassword , rePassword} = req.body

  const user = await userModel.findOne({_id:req.user.id})
  if(!user){
    return next(new Error("Invalid user"))
  }
  const matchPass= bcrypt.compareSync(oldPassword,user.password)
  if(!matchPass){
    return next (new Error("OldPassword is incorrect"))
  }
  if(newPassword !== rePassword){
    return next(new Error("Password not matcing"))
  }
  const hashPass = bcrypt.hashSync(newPassword,+process.env.SALT_ROUND)
  const updateUser = await userModel.updateOne({_id:req.user.id} , {password:hashPass})
  if (updateUser.modifiedCount > 0) {
    return res.status(200).json("Password changed ");
  }
  return next(new Error("Failed", { cause: 400 }));
})

// ******************************signin********************

export const signIn = catchError(async (req, res, next) => {
  const { email, password } = req.body;

  const userName = await userModel.findOne({ email , confirmEmail:true});
  if (!userName?.email) {
    return next(new Error("Invalid email or password"));
  }
  const matchPass = bcrypt.compareSync(password, userName.password);
  if (!matchPass) {
    return next(new Error("Email or password is incorrect"));
  }
  const token = jwt.sign(
    { id: userName._id, role: userName.role },

    process.env.TOKEN_SIGNATURE
  );
  return res.status(200).json({ msg: "Hello" ,token});
});

// **************Update user date**********************
export const updateData = catchError(async(req,res,next)=>{
  const {firstName,lastName,email,phone} = req.body
const user = await userModel.findById({_id:req.user.id})
if(firstName){
  
  if(firstName.toLowerCase() === user.firstName.toLowerCase() ){
    
return next(new Error("This name already exist" ,{cause:409}))
    }
    user.firstName = firstName.toLowerCase()
    user.userName = firstName +' '+ user.lastName

  }
  if(lastName){

    if(lastName.toLowerCase()=== user.lastName.toLowerCase() ){
return next(new Error("This name already exist" ,{cause:409}))
    }
    user.lastName = lastName.toLowerCase()
    user.userName = user.firstName +' '+ lastName
  }

  if(email){

    if(email.toLowerCase()=== user.email.toLowerCase() ){
return next(new Error("This email already exist" ,{cause:409}))
    }
    user.email = email.toLowerCase()
  
}
if(phone){

  if(phone.toLowerCase()=== user.phone.toLowerCase() ){
return next(new Error("This phone already exist" ,{cause:409}))
  }
  user.phone = phone.toLowerCase()
}
if(req.file){
  await cloudinary.uploader.destroy(user.image.public_id);

  const  {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
    folder:`TaskManagement/users/${req.user.id}/profileImg/${user.customID}`
      })
      
      user.image = {secure_url,public_id} 
    }
await user.save()
return res.status(200).json({msg:"updated"})

})

// ***********Delete user account**************************
export const deleteAccount = catchError(async(req,res,next)=>{
  const {id}= req.params
  const user = await userModel.findOne({_id:id , role:"Admin"})
  if(!user){
    console.log(user);
    return next(new Error("Invalid user" ,{cause:400}))
  }
  await cloudinary.uploader.destroy(user.image.public_id)
  await userModel.deleteOne(user)
 return res.status(200).json("Deleted")
 
})

// ***********get all users**********************
export const getusers = catchError(async (req, res, next) => {

 
const {limit,skip} = pagenate({page:req.query.page , size:req.query.size})
  const users = await userModel
    .find({})
    .skip(skip)
    .limit(limit)
    
  users
    ? res.status(200).json({ msg: "Users", users })
    : next(new Error("Falied", { cause: 400 }));
});




// *********************get a specific user*************************
export const oneUser = catchError(async(req,res,next)=>{
  const {id} = req.params
  const user = await userModel.findById(id)
  user ? res.status(200).json({msg:"Done" , user}):next(new Error("Invalid user",{cause:400}))
})