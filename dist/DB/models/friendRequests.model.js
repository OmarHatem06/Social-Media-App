import mongoose, { Schema, Types } from "mongoose";
import { ref } from "node:process";
export const FriendRequestSchema = new Schema({
    SendFrom: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    SendTo: { type: Schema.Types.ObjectId, ref: "Users", required: true },
}, { timestamps: true });
FriendRequestSchema.index({ SendTo: 1, SendFrom: 1 });
export const FriendRequestModel = mongoose.model("FriendRequests", FriendRequestSchema);
