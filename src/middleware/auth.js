import jwt from "jsonwebtoken"
import { userModel } from "../../DB/models/user.js"
import { catchError } from "../utilts/catchError.js"

export const userAuthentication = catchError( async(req,res,next)=>{
    const{token}= req.headers

    if(!token){
        return next(new Error("Token not provided",{cause:404}))
    }
    if(!token.startsWith(process.env.BEARER_KEY)){
        return next(new Error("Invalid token",{cause:400}))
    }
    const baseToken = token.split(process.env.BEARER_KEY)[1]
    const decoded = jwt.verify(baseToken,process.env.TOKEN_SIGNATURE)
    if(!decoded?.id){
        return next(new Error("Invalid user ID",{cause:400}))
    }

    const user = await userModel.findOne({_id:decoded.id})
    if(!user){
        return next(new Error("No user found",{cause:400}))
    }
    if(user?.passChangedAt){
        const passChanged = parseInt( user.passChangedAt.getTime()/1000)
        if(passChanged > decoded.iat){
            return next(
                new Error("User not authenticated,Please login", { cause: 401 }))
        }
    }
  req.user = user
  next()
})

// *******Authorization
export const allowTo =(...roles)=>{

    return catchError(async(req,res,next)=>{
        if(!roles.includes(req.user.role)){
      return next(new Error("User not authorized", { cause: 401 }));

        }
        next()
    })
}