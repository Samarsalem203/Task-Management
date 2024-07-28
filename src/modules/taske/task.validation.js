import joi from "joi"

export const newTask= {
    body:joi.object().required().keys({
        name:joi.string().min(3).max(25).required(), 
        deadline:joi.string().required(), 
        assignTo:joi.string().min(24).max(24), 
      role: joi.string().valid("user", "admin"),
      shareOption:joi.string().valid("public" ,"private"),
        priority:joi.string().valid("high" ,"medium","low")

    }),
    file:joi.object().required().keys({
        size:joi.number().positive().required(),
        path:joi.string().required(),
        filename:joi.string().required(),
        destination:joi.string().required(),
        mimetype:joi.string().required(),
        encoding:joi.string().required(),
        originalname:joi.string().required(),
        fieldname:joi.string().required()

    })
}

// **********************************************
export const editTask=
{
    body:joi.object().required().keys({
       name:joi.string().min(3).max(25), 
        deadline:joi.string(), 
        assignTo:joi.string().min(24).max(24),
        role: joi.string().valid("User", "Admin"),
        shareOption:joi.string().valid("Public" ,"Private")
    }),
    params:joi.object().required().keys({
        id:joi.string().min(24).max(24).required()
    }),
    file:joi.object().keys({
        size:joi.number().positive().required(),
        path:joi.string().required(),
        filename:joi.string().required(),
        destination:joi.string().required(),
        mimetype:joi.string().required(),
        encoding:joi.string().required(),
        originalname:joi.string().required(),
        fieldname:joi.string().required()

    })
}
// *****************************
export const deleteTask ={
    parama:joi.object().required().keys({
        id:joi.string().min(24).max(24).required()
    })
}
