import slugify from "slugify";
import { catModel } from "../../../DB/models/category.js";
import { taskModel } from "../../../DB/models/task.js";
import { catchError } from "../../utilts/catchError.js";
import { pagenate } from "../../services/pagenation.js";
import cloudinary from "../../utilts/cloudinary.js";



export const addTask = catchError(async (req, res, next) => {

  const { catID } = req.params;

  const category = await catModel.findById({ _id: catID });
  if (!category) {
    return next(new Error("Invalid category", { cause: 400 }));
  }
  // 1-List of Tasks
  if (Array.isArray(req.body)) {
   
    req.body.map(async(obj) => {
    
      const taskExist = await taskModel.findOne({
        name:obj.name.toLowerCase()
      })
   
    if (taskExist) {
    return next (new Error("This task name already exist", { cause: 400 }))
  
  }
     obj.slug = slugify(obj.name)
      obj.categoryID = catID
      obj.createdBy = req.user.id
 await taskModel.create(obj)

});
return res.json({msg:"Done"})




}

// 2-Text Task
  const taskExist = await taskModel.findOne({ name:req.body.name.toLowerCase() });
  if (taskExist) {
    return next(new Error("This task already exist"));
  }
  if(!req.file){
    return next(new Error("Task file is required",{cause:400}))
  }

const  {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
folder:`TaskManagement/users/tasks/${req.body.assignTo}`
  })
  

  req.body.slug = slugify(req.body.name)
  req.body.taskFile = {secure_url,public_id}
  req.body.categoryID = catID
  req.body.createdBy = req.user.id

   let task = await taskModel.create(req.body)

  if(!task){
    await cloudinary.uploader.destroy(public_id)
    return next(new Error("Cannot add task",{cause:400}));
  }
  return res.status(201).json({ msg: "Task added", task })
 
});

// ***************update task*****************
export const editTask = catchError(async (req, res, next) => {
  const { name, deadline, assignTo } = req.body;
  const { id } = req.params;

  const task = await taskModel.findOne({ _id: id, createdBy: req.user.id });
  if (!task) {
    return next(new Error("Invalid task ", { cause: 400 }));
  }
 
 
  if (name) {
    if (name.toLowerCase() === task.name) {
      return next(new Error("This task already exist", { cause: 400 }));
    }
    task.name = name.toLowerCase();
    task.slug= slugify(name)
  }

  if (deadline) {
    if (deadline === task.deadline) {
      return next(
        new Error("This value is the same as the existing one", { cause: 400 })
      );
    }
    task.deadline = deadline;
  }

  if (assignTo) {
    if (assignTo === task.assignTo) {
      return next(
        new Error("This value is the same as the existing one", { cause: 400 })
      );
    }
    task.assignTo = assignTo;
  }
  if(req.file){
    await cloudinary.uploader.destroy(task.taskFile.public_id);

    const  {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
      folder:`TaskManagement/users/tasks/${task.assignTo}`
        })
        
        task.taskFile = {secure_url,public_id} 
      }

 await task.save();

  return res.status(200).json("Updated");
});

// *************** Delete task****************************
export const deleteTask = catchError(async (req, res, next) => {
  const { id } = req.params;

  const task = await taskModel.findOneAndDelete({
    _id: id,
    $or: [{ createdBy: req.user.id }, { role: "Admin" }],
  });
  task
    ? res.status(200).json({ msg: "Task deleted" })
    : next(new Error("Cannot delete task", { cause: 400 }));
});

// **************************Get all tasks*******************************************
export const allTasks = catchError(async (req, res, next) => {

const {limit,skip} = pagenate({page:req.query.page , size:req.query.size})
  const tasks = await taskModel
    .find({})
    .skip(skip)
    .limit(limit)
    .populate("categoryID");
  tasks
    ? res.status(200).json({ msg: "Tasks",  tasks })
    : next(new Error("Falied", { cause: 400 }));
});

// **************************Get task based on share option*******************************************
export const taskShareOptn = catchError(async (req, res, next) => {
const{shareOption} = req.params
  const {limit,skip} = pagenate({page:req.query.page , size:req.query.size})

  if(shareOption ===  "private"){
    const privateTasks = await taskModel
    .find({createdBy:req.user.id, shareOption})
    .skip(skip)
    .limit(limit)
    .populate({
       path: "categoryID",
        options:{sort:{name:-1}}
  });

    privateTasks
    ? res.status(200).json({ msg: "Tasks",  privateTasks })
    : next(new Error("Falied", { cause: 400 }));
  }
  if(shareOption === "public"){
const publicTasks = await taskModel
      .find({shareOption})
      .skip(skip)
      .limit(limit)
      .populate({path:"categoryID",
        options:{sort:{name:-1}}
      });
      publicTasks
      ? res.status(200).json({ msg: "Tasks",  publicTasks })
      : next(new Error("Falied", { cause: 400 }));
  }
    
  });
  