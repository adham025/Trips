import mongoose from "mongoose";
import tripModel from "../../../DB/model/trip.model.js";
import userModel from "../../../DB/model/user.model.js";

export const getWishlist = async (req, res, next) => {
  try {
    const { userId } = req;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const user = await userModel.findById(userId).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { userId } = req;
    let { tripId } = req.params;

    if (!tripId) {
      return res.status(400).json({ message: "Trip ID is required." });
    }

    tripId = tripId.trim();
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid trip ID format." });
    }

    const trip = await tripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip doesn't exist." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.wishlist.includes(tripId)) {
      return res.status(400).json({ message: "Trip is already in your wishlist." });
    }

    user.wishlist.push(tripId);
    await user.save();

    await user.populate("wishlist");

    res.status(201).json({ message: "Trip added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { userId } = req;
    let { tripId } = req.params;

    if (!tripId) {
      return res.status(400).json({ message: "Trip ID is required." });
    }

    tripId = tripId.trim();
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid trip ID format." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.wishlist.includes(tripId)) {
      return res.status(400).json({ message: "Trip is not in your wishlist." });
    }

    user.wishlist = user.wishlist.filter(id => id.toString() !== tripId);
    await user.save();

    await user.populate("wishlist");

    res.json({ message: "Trip removed successfully!", wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
};
export const checkWishlistStatus = async (req, res, next) => {
  try {
    const { userId } = req;
    let { tripId } = req.params;

    if (!tripId) {
      return res.status(400).json({ message: "Trip ID is required." });
    }

    tripId = tripId.trim();
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid trip ID format." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const inWishlist = user.wishlist.includes(tripId);

    res.json({ inWishlist });
  } catch (err) {
    next(err);
  }
};

