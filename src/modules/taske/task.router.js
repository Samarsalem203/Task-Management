import {Router} from "express"
const router = Router()
import * as auth from "../../middleware/auth.js"
import * as validators from "./task.validation.js"
import { validation } from "../../middleware/validation.js"
import { addTask, allTasks, deleteTask, editTask, taskShareOptn } from "./task.controller.js"
import { myMulter } from "../../services/multerCloud.js"
import { validExtension } from "../../utilts/validExtension.js"

router.post("/newTask/:catID",auth.userAuthentication,validation(validators.newTask), myMulter(validExtension.doc).single("file"),addTask) 
router.put("/editTask/:id" ,auth.userAuthentication, auth.allowTo("Admin"),validation(validators.editTask),myMulter(validExtension.doc).single("file"),editTask)
router.delete("/deleteTask/:id" ,auth.userAuthentication,validation(validators.deleteTask) , deleteTask)
router.get("/tasks",auth.userAuthentication,allTasks)
router.get("/shareTasks/:shareOption" ,auth.userAuthentication ,taskShareOptn)
export default router
