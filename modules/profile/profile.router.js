import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { changePassValidation } from "../auth/auth.validation.js";
import {
  accountController,
  addProfileImage,
  changePassword,
  deleteAccount,
  getUserDataInAccount,
} from "./profile.controller.js";
import { auth, roles } from "../../middleware/auth.js";
import { myMulter } from "../../services/multer.js";
import { asyncHandler } from "../../services/asyncHandler.js";

const profileRoutes = Router();

profileRoutes.put("/account" , auth([roles.User,roles.Admin]) , accountController)
profileRoutes.get("/data" , auth([roles.User , roles.Admin]) , getUserDataInAccount)
profileRoutes.patch("/changePass" , changePassValidation , auth([roles.User]) , changePassword)
profileRoutes.delete("/deleteAccount" , auth([roles.User , roles.Admin]) , deleteAccount);

profileRoutes.post(
  "/profile/upload/profile",
  auth(),
  myMulter().single("avatar"),
  asyncHandler(addProfileImage)
);
export default profileRoutes;
