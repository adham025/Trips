import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { changePassValidation } from "../auth/auth.validation.js";
import { accountController, addProfileImage, changePassword, deleteAccount, getUserDataInAccount } from "./profile.controller.js";
import { auth, roles } from "../../middleware/auth.js";
import { myMulter } from "../../services/multer.js";
import { asyncHandler } from "../../services/asyncHandler.js";

const profileRoutes = Router();

profileRoutes.put("/profile/account" , auth([roles.User]) , accountController)
profileRoutes.get("/profile/account/data" , auth([roles.User]) , getUserDataInAccount)
profileRoutes.patch("/profile/changePass" , changePassValidation , auth([roles.User]) , changePassword)
profileRoutes.delete("/profile/deleteAccount" , auth() , deleteAccount);

profileRoutes.post("/upload/profile",auth(), myMulter().single("avatar") ,asyncHandler( addProfileImage))
export default profileRoutes;
