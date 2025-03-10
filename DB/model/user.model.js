import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 20 char"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique value"],
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    image: {type:String , default : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" },
    lastSeen: { type: Date, default: Date.now },
    wishlist: [
      {
        type: Types.ObjectId,
        ref: "trip",
      },
    ],
    code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = model("user", userSchema);
export default userModel;
