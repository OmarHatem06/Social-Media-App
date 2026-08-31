import { z } from "zod";
import { RoleEnum } from "../../Utils/enums/user.enums.js";
import { error } from "node:console";
export const CreateCommentSchema = {
    body: z.strictObject({
        content: z.string().min(1, { message: "Content is required" }),
        parentId: z.string().min(1, { message: "Content is required" }).optional(),
        attachments: z.string().optional(),
    }),
    params: z.strictObject({
        postId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "invalid id" }),
    }),
};
export const PostIdSchema = {
    params: z.strictObject({
        postId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "invalid id" }),
    }),
};
export const UpdateCommentSchema = {
    params: z.strictObject({
        CommentId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "invalid id" }),
    }),
    body: z.strictObject({
        content: z.string().min(1, { message: "Content is required" }),
    }),
};
export const UpdatePostSchema = {
    params: z.strictObject({
        postId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "invalid id" }),
    }),
    body: z.strictObject({
        content: z.string().min(1, { message: "Content is required" }),
    }),
};
export const DeleteCommentSchema = {
    params: z.strictObject({
        CommentId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "invalid id" }),
    }),
};
export const DeletePostSchema = {
    params: z.strictObject({
        CommentId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "invalid id" }),
    }),
};
export const userIdSchema = {
    params: z.strictObject({
        userId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "invalid id" }),
    }),
};
