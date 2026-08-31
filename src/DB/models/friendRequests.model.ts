import mongoose, { Schema, Types, type HydratedDocument } from "mongoose";
import { ref } from "node:process";

export interface IFriendRequest {
  _id: Types.ObjectId;
  SendFrom: Types.ObjectId;
  SendTo: Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

export const FriendRequestSchema = new Schema<IFriendRequest>(
  {
    SendFrom: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    SendTo: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  },
  { timestamps: true },
);
FriendRequestSchema.index({ SendTo: 1, SendFrom: 1 });
export const FriendRequestModel = mongoose.model(
  "FriendRequests",
  FriendRequestSchema,
);
export type HFriendRequestDocument = HydratedDocument<IFriendRequest>;
