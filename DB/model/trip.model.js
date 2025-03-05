import { Schema, model, Types } from "mongoose";

const tripSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    departureDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Departure date must be in the future.",
      },
    },
    returnDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.departureDate || value > this.departureDate;
        },
        message: "Return date must be after the departure date.",
      },
    },
    images: [String],
    publicImageIds: [String],
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive value."],
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, "Available seats cannot be negative."],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    categoryId: {
      type: Types.ObjectId,
<<<<<<< HEAD
      ref: "Category",
      required: [true, "CategoryId is required"],
    },
=======
      ref: "category",
      required: [true, 'CategoryId is required']
  },
>>>>>>> 227449286c00a38c04819f414de46837f588536e
    reviews: [
      {
        type: Types.ObjectId,
        ref: "review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const tripModel = model("trip", tripSchema);

export default tripModel;
