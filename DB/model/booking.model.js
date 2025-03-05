import { Schema, model, Types } from "mongoose";

const bookingSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    tripId: {
      type: Types.ObjectId,
      ref: "trip",
      required: true,
    },
    numberOfPeople: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const bookingModel = model("booking", bookingSchema);

export default bookingModel;
