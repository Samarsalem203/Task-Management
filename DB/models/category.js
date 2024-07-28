import { Schema,model ,Types} from "mongoose";

const catSchema = new Schema({
    name:{
        type:String,
        unique:true,
        minLength:4,
        maxLength:25
    },
    slug:{
        type:String,
        unique:true,
        minLength:3,
        maxLength:25
    }
    ,
    shareOption:{
       type:String,
       enum:["public" , "private"],
       default:"private"
    },
    createdBy:{type:Types.ObjectId , required:true}
       
    
},{timestamps:true,
    toJSON:{virtuals:true} //To include virtuals in res.json
})

catSchema.virtual("tasks",{
    ref:"task",  // task schema
    localField:"_id",    // category id as a primary key
    foreignField:"categoryID"  ,
    justOne: true   // return tasks as an object not array of object
})




export const catModel = model("category" , catSchema)