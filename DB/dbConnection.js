import mongoose from "mongoose"

export const dbConnection= async()=>{
await mongoose.connect(process.env.DB_URL).then(()=>{
    console.log('DB connected....');
}).catch((err)=>{
    console.log('Connection Failed ' , err);
})
}