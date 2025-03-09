import tripModel from "../../../DB/model/trip.model.js";
import categoryModel from "../../../DB/model/category.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import slugify from "slugify";
import cloudinary from "../../../services/cloudinary.js";
import { findOne } from "../../../DB/DBMethods.js";
// import ApiFeatures from "../../../Utiletis/apiFeatures.js";

export const addTrip = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  let foundedCategory = await findOne({
    model: categoryModel,
    condition: { _id: id },
  });

  if (!foundedCategory) {
    return next(new Error("Category not found", { cause: 404 }));
  }

  if (!req.files?.length) {
    return next(new Error("You have to add images", { cause: 400 }));
  }

  if (!req.body.startPoint || req.body.startPoint.length === 0) {
    console.log(req.body.startPoint);

    return next(new Error("You must provide start point", { cause: 400 }));
  }

  let startPoints = [];
  for (let i = 0; i < req.body.startPoint.length; i++) {
    startPoints.push(req.body.startPoint[i]);
  }

  if (!req.body.destination) {
    return next(new Error("Destination is required", { cause: 400 }));
  }

  let imagesUrl = [];
  let imageIds = [];

  for (const file of req.files) {
    try {
      let { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: "2025/trips",
        }
      );
      imagesUrl.push(secure_url);
      imageIds.push(public_id);
    } catch (error) {
      console.error("Cloudinary Upload Failed:", error);
      return next(new Error("Error uploading images", { cause: 500 }));
    }
  }

  const allowedFields = [
    "title",
    "description",
    "price",
    "departureDate",
    "returnDate",
    "startPoint",
  ];
  const tripData = {};
  allowedFields.forEach((field) => {
    if (req.body[field]) tripData[field] = req.body[field];
  });

  tripData.categoryId = id;
  tripData.slug = slugify(req.body.title);
  tripData.createdBy = req.user._id;
  tripData.images = imagesUrl;
  tripData.publicImageIds = imageIds;
  tripData.startPoint = req.body.startPoint;
  tripData.destination = req.body.destination;

  const trip = await tripModel.create(tripData);

  if (!trip) {
    for (const id of imageIds) {
      await cloudinary.uploader.destroy(id);
    }
    return next(new Error("Error while inserting to DB", { cause: 400 }));
  }

  const responseTrip = trip.toObject();
  delete responseTrip.__v;

  res.status(201).json({ message: "Success", responseTrip });
});

export const getAllTrips = asyncHandler(async (req, res, next) => {
  let allTrips = await tripModel.find().populate("categoryId", "name");
  res.json({ message: "Success", allTrips });
});

export const getTripById = asyncHandler(async (req, res, next) => {
  try {
    const trip = await tripModel.findById(req.params.id);

    if (!trip) {
      const error = new Error("Trip not found");
      error.cause = 404;
      throw error;
    }

    res.json({ message: "Success", trip });
  } catch (error) {
    if (!error.cause) error.cause = 500;
    next(error);
  }
});

export const updateTrip = asyncHandler(async (req, res, next) => {
  const trip = await tripModel.findById(req.params.id);

  if (!trip) {
    return next(new Error("Trip not found", { cause: 404 }));
  }

  const newImages = [];
  const imagesToDelete = [];

  try {
    if (req.files?.length) {
      for (const file of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          { folder: "2025/trips" }
        );
        trip.images.push(secure_url);
        trip.publicImageIds.push(public_id);
        newImages.push(public_id);
      }
    }

    if (req.body.deletedImageIds?.length) {
      const validDeletedIds = trip.publicImageIds.filter((id) =>
        req.body.deletedImageIds.includes(id)
      );

      validDeletedIds.forEach((id) => {
        const index = trip.publicImageIds.indexOf(id);
        if (index > -1) {
          trip.publicImageIds.splice(index, 1);
          trip.images.splice(index, 1);
          imagesToDelete.push(id);
        }
      });
    }

    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    Object.assign(trip, req.body);

    const updatedTrip = await trip.save();
    const responseTrip = updatedTrip.toObject();
    delete responseTrip.__v;

    if (imagesToDelete.length) {
      await Promise.all(
        imagesToDelete.map((id) => cloudinary.uploader.destroy(id))
      );
    }

    res.status(200).json({ message: "Success", responseTrip });
  } catch (error) {
    if (newImages.length) {
      await Promise.all(newImages.map((id) => cloudinary.uploader.destroy(id)));
    }
    return next(new Error(error.message || "Update failed", { cause: 400 }));
  }
});

export const deleteTrip = asyncHandler(async (req, res, next) => {
  try {
    const trip = await tripModel.findByIdAndDelete(req.params.id);

    if (!trip) {
      const error = new Error("Trip not found");
      error.cause = 404;
      throw error;
    }

    res.status(200).json({ message: "Success" });
  } catch (error) {
    if (!error.cause) error.cause = 500;
    next(error);
  }
});
