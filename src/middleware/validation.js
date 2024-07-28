const methods = ['body','params','query','headers']

export const validation=(schema)=>{
    const validationError=[]
return(req,res,next)=>{
    methods.map((key)=>{
        if(schema[key]){
            const validationResult = schema[key].validate(req[key],{abortEarly:false})
            if(validationResult?.error?.details){
                validationError.push(validationResult.error.details)
            }
        }
    })
   
    if(validationError.length){
        return res.status(400).json({msg:"validation error",err:validationError})
    }
    next()
}
}