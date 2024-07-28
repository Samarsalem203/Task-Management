


import{model,Schema, Types} from 'mongoose'

const taskSchema = new Schema({
    name:{
        type:String,
        minLength:3,
        maxLength:25,
        required:[true , "Name task is required"],
        trim:true,
        lowercase:true,
        unique:[true , "This task already exist"]

    },
  slug:{
    type:String,
        minLength:3,
        maxLength:25,
        trim:true,
        lowercase:true,
        unique:[true , "This task already exist"]
  },
    deadline:{
        type:String,
        required:true,
        minLength:5,
        maxLength:10
    },
    assignTo:{
        type:String,
        required:true
    },
    priority:{
       type:String,
     
       lowercase:true,

       enum:["high" , "medium" , "low"],
       default:"high"
    },
    shareOption:{
        type:String,
   
        lowercase:true,

        enum:["public" , "private"],
        default:"private"
     },
  taskFile:{
type:Object,
required:true
  },
    role:{
type:String,
lowercase:true,
enum:["user" , "admin"],
default:"user"

    },
    customID:String,
    createdBy:{
        type:Types.ObjectId,
        required:true,
        trim:true
    }
,
categoryID:{
    type:Types.ObjectId,
    ref:"category"
}
},{timestamps:true})


export const taskModel = model("task" , taskSchema)