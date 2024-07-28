import joi from "joi";

// ***signUp*****
export const signUp = {
  body: joi
    .object()
    .required()
    .keys({
      firstName:joi.string().min(2).max(15).required(),
      lastName: joi.string().min(2).max(15).required(),
      email: joi.string().email().required(),
      password: joi
        .string()
        .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).messages({'any.only': 'password does not match' }).required(),
      role: joi.string().valid("User", "Admin"),
      phone: joi.string().min(6).required(),

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
};
// ***confirmEmail*****
export const confirmEmail={
    params:joi.object().required().keys({
        token:joi.string().required()
    })
}
// ***reFresh token*****
export const reFreshToken={
    params:joi.object().required().keys({
        rfToken:joi.string().required()
    })
}
// ***forgot Password*****
export const forgotPass={
    body:joi.object().required().keys({
        email:joi.string().email().required()
    })
}
// ***reset password*****
export const resetPass = {
    body:joi.object().required().keys({
        email:joi.string().email().required() , 
        code:joi.string().required(), 
        newPassword:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required() ,
        rePassword:joi.string().valid(joi.ref("newPassword")).required()
    })
}
// ***Change Password
export const changePass ={
    body:joi.object().required().keys({
        oldPassword: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
         newPassword:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required() ,
          rePassword:joi.string().valid(joi.ref("newPassword")).required()
    })
}


// ***signIn*****
export const signIn= {
    body:joi.object().required().keys({
email:joi.string().email().required(),
password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required()
    })
}

// ***Delete Account******
export const deleteAccount ={
    params:joi.object().required().keys({
        id:joi.string().min(24).max(24).required()
    })
}