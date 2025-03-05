import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { changePassValidation } from "../auth/auth.validation.js";
import { addProfileImage, changePassword, deleteAccount } from "./profile.controller.js";
import { auth } from "../../middleware/auth.js";
import { myMulter } from "../../services/multer.js";
import { asyncHandler } from "../../services/asyncHandler.js";

const profileRoutes = Router();

profileRoutes.patch("/profile/changePass" , validation(changePassValidation) , auth() , changePassword)
profileRoutes.delete("/profile/deleteAccount" , auth() , deleteAccount)

profileRoutes.post("/upload/profile",auth(), myMulter().single("avatar") ,asyncHandler( addProfileImage))
export default profileRoutes;
