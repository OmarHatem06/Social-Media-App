import mongoose, { Schema } from "mongoose";
import { string } from "zod";
const CommentSchema = new Schema({
    content: {
        type: String,
        minLength: [2, "Minimum is 2 letters"],
        maxLength: [50000, "Maximum is 50000 letters "],
        required: true,
    },
    parentId: { type: Schema.Types.ObjectId, ref: "Comments" },
    postId: { type: Schema.Types.ObjectId, ref: "Posts", required: true },
    attachments: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
}, { timestamps: true });
CommentSchema.index({ postId: 1, createdAt: -1 });
export const CommentsModel = mongoose.model("Comments", CommentSchema);
