import { Router } from "express";
import { searchController } from "./search.controller.js";
const searchRoutes = Router();

searchRoutes.get("" , searchController);

export default searchRoutes;