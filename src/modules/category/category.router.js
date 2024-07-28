import {Router} from "express"
import * as auth from "../../middleware/auth.js"
import * as validators from "./category.validation.js"
import { createCategory, deleteCat, getCategories, updateCategory } from "./category.controller.js"
import { validation } from "../../middleware/validation.js"


const router = Router()

router.post("/create" ,auth.userAuthentication, validation(validators.create),createCategory)
router.put("/updateCat/:id" , auth.userAuthentication ,validation(validators.update),updateCategory)
router.delete("/delete/:id" , auth.userAuthentication,validation(validators.deleteCategory),deleteCat)
router.get("/all",auth.userAuthentication, getCategories)//,auth.userAuthentication
// router.get("/shareOptn/:shareOption",auth.userAuthentication , taskBasedShareOptn)
export default router