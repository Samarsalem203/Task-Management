import express from "express"
const app = express()
import userRouter from "./src/modules/user/user.router.js"
import  taskRouter from "./src/modules/taske/task.router.js"
import catRouter from "./src/modules/category/category.router.js"
import dotenv from "dotenv"
dotenv.config({path:"./config/.env"})
import { dbConnection } from "./DB/dbConnection.js"

const port = process.env.PORT || 4000

app.use(express.json())

// DB connection
dbConnection()

// Routes
app.use("/user" , userRouter)
app.use("/task" , taskRouter)
app.use("/category" , catRouter)

// unknown routes
app.all("*",(req,res,next)=>{
    res.status(400).json({message:`Can't find this route:${req.originalUrl}`})

})

//Global Error handling
app.use((err,req,res,next)=>{
    if(err['cause']){
 return res.status(err['cause']).json({err:err.message})
    }
   
return res.status(400).json({err:err.message, stack:err.stack})
})


app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
})






