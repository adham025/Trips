import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    trip: {
      type: Types.ObjectId,
      ref: "trip",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxLength: 500,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, trip: 1 }, { unique: true });

const reviewModel = model("review", reviewSchema);

export default reviewModel;
