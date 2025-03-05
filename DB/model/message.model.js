import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "conversation" },
    sender: { type: Schema.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true },
    type: { type: String, default: "text" },
    isdelivered: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt" } }
);

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;
