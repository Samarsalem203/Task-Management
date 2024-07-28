import { Schema , Types, model } from "mongoose";

const userSchema = new Schema({
  firstName:{
        type:String,
        required:[true,'First name is required'],
        trim:true,
        lowercase:true,
        minLength:2,
        maxLength:20
    },
lastName:{
    type:String,
    required:[true,"Last name is required"],
    lowercase:true,
    minLength:2,
    maxLength:20,
    trim:true
},

   email:{
        type:String,
        required:[true,'Email is required'],
        lowercase:true,
        unique:[true , 'Email must be unique,Please try another email'],
        trim:true
    },
    password:{
        type:String,
        trim:true,
        required:[true,'password is required'],
},

phone:{
    type:String,
    required:[true,"Phone is required"],
    unique:true
},
passChangedAt:Date,
role:{
    type:String,
    enum:['User','Admin'],
    default:'User'
},
image:Object,
customID:String,
confirmEmail:{
    type:Boolean,
    default:false
},
code:{type:Number , default:0}
}

,{timestamps:true})



export const userModel = model('user' , userSchema)    