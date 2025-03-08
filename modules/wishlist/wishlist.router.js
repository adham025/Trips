import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
} from "./controller/wishlist.controller.js";
import { auth } from "../../middleware/auth.js";

const wishlistRoutes = express.Router();

wishlistRoutes.get("/", auth(), getWishlist);
wishlistRoutes.post("/add/:tripId", auth(), addToWishlist);
wishlistRoutes.delete("/remove/:tripId", auth(), removeFromWishlist);
wishlistRoutes.get("/status/:tripId", auth() , checkWishlistStatus); 


export default wishlistRoutes;
