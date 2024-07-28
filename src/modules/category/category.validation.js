import joi from "joi"

export const create = {
    body:joi.object().required().keys({
        name:joi.string().min(3).max(25).required(),
        slug:joi.string().min(3).max(25),
    })
}

// update category
export const update = {
    body:joi.object().required().keys({
        name:joi.string().min(3).max(25).required(),
        slug:joi.string().min(3).max(25),
    }),
    params:joi.object().required().keys({
      id:joi.string().min(24).max(24).required()
    })
}

// Delete category
export const deleteCategory ={
    parama:joi.object().required().keys({
        id:joi.string().min(24).max(24).required()
    })
}