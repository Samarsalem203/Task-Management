import { catModel } from "../../../DB/models/category.js";
import { taskModel } from "../../../DB/models/task.js";
import { pagenate } from "../../services/pagenation.js";
import { catchError } from "../../utilts/catchError.js";
import slugify from "slugify";

export const createCategory = catchError(async (req, res, next) => {
  const { name } = req.body;
  const category = await catModel.findOne({ name });
  if (category) {
    return next(new Error("category name already exist", { cause: 400 }));
  }

  const slug = slugify(name, {
    replacement: "=",
    trim: true,
    lower: true,
  });

  const createCat = await catModel.create({
    name,
    slug,
    createdBy: req.user.id,
  });
  createCat
    ? res.status(201).json({ msg: "Category created", createCat })
    : next(new Error("Cannot create category", { cause: 400 }));
});

// ***************Update Category********************
export const updateCategory = catchError(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  const category = await catModel.findOne({ _id: id, createdBy: req.user.id });

  if (!category) {
    return next(new Error("Invalid category", { cause: 400 }));
  }

  if (name) {
    if (name.toLowerCase() === category.name) {
      return next(
        new Error("This name already exist,Please try another one", {
          cause: 400,
        })
      );
    }
    category.name = name.toLowerCase();
    category.slug = slugify(name, {
      replacement: "_",
      lower: true,
      trim: true,
    });
  }
  category.save();
  category
    ? res.status(200).json({ msg: "Category updated", category })
    : next(new Error("Cannot update category", { cause: 400 }));
});

// Delete category
export const deleteCat = catchError(async (req, res, next) => {
  const { id } = req.params;
  const category = await catModel.findOne({ _id: id, createdBy: req.user.id });
  if (category) {
    await catModel.deleteOne({ _id: id });
    const task = await taskModel.deleteMany({ categoryID: category._id });
    if (!task.deletedCount) {
      return next(new Error("Invalid task", { cause: 400 }));
    }
    return res.status(200).json("Document deleted");
  }

  return next(new Error("Invalid category", { cause: 400 }));
});

// **************Get all categories with it has tasks (using virtual key)*******************************
export const getCategories = catchError(async (req, res, next) => {
  const { limit, skip } = pagenate({
    page: req.query.page,
    size: req.query.size,
  });

  let categories = await catModel
    .find({})
    .skip(skip)
    .limit(limit)
    .sort("name")
    .populate("tasks"); // virtual key

  categories
    ? res.status(200).json({ msg: "Categories", categories })
    : next(new Error("Cannot get categories", { cause: 400 }));
});

// ***********************************************

