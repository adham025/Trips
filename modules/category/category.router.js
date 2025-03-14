import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./category.endPoint.js";
import * as categoryController from "./controller/category.controller.js";
const router = Router();

router.post(
  "/add",
  auth(endPoints.addCategory),
  categoryController.addCategory
);
router.delete("/:id", auth(endPoints.addCategory), categoryController.deleteCategory);
router.get("/all", categoryController.categories);
router.get(
  "/:categoryId",
  auth(endPoints.addCategory),
  categoryController.getCategoryById
);
router.put(
  "/update/:id",
  auth(endPoints.updateCategory),
  categoryController.updateCategory
);

export default router;
