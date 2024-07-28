import { Router } from "express";
import {
  changePass,
  confirmEmail,
  deleteAccount,
  forgotPass,
  getusers,
  newUser,
  oneUser,
  reConfirm,
  resetPass,
  signIn,
  updateData,
} from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import * as auth from "../../middleware/auth.js";
import * as validators from "./user.validation.js";
import { myMulter } from "../../services/multerCloud.js";


const router = Router();

// Sign Up
router.post("/newUser", myMulter().single("image"),validation(validators.signUp),newUser);

// Confirm Email
router.get(
  "/confirm/:token",
  validation(validators.confirmEmail),
  confirmEmail
);
// Refresh Token
router.get(
  "/reconfirm/:rfToken",
  validation(validators.reFreshToken),
  reConfirm
);
// Forgot Password
router.put("/forgotPass", validation(validators.forgotPass), forgotPass);
// Reset Password
router.put("/resetPass", validation(validators.resetPass), resetPass);

// Change Password
router.put(
  "/changePass",
  auth.userAuthentication,
  validation(validators.changePass),
  changePass
);
// Update
router.patch("/updateAccount", auth.userAuthentication,myMulter(validExtension.image).single("image"),updateData);

// Delete
router.delete(
  "/deleteAccount/:id",
  auth.userAuthentication,
  validation(validators.deleteAccount),
  deleteAccount
);

// Login
router.post("/login", signIn);
// get all users
router.get("/all", getusers);

// get a specific user
router.get("/oneUser/:id" ,auth.userAuthentication ,oneUser)


export default router;
