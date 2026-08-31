import mongoose, { Schema, Types } from "mongoose";
import { ref } from "node:process";
export const PostSchema = new Schema({
    content: {
        type: String,
        minlength: [2, "minimum length is 2"],
        maxlength: [1000, "maximum length is 1000"],
        required: function () {
            return !this.attachments?.length;
        },
    },
    attachments: [
        {
            type: String,
        },
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    FreezedAt: {
        type: Date,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    tags: [{ type: Schema.Types.ObjectId, ref: "Users" }],
}, { timestamps: true });
PostSchema.index({ createdBy: 1, createdAt: -1 });
export const PostModel = mongoose.model("Posts", PostSchema);
