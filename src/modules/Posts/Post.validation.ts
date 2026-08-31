import { z } from "zod";
import { RoleEnum } from "../../Utils/enums/user.enums.js";
import { error } from "node:console";

export const CreatePostSchema = {
  body: z.strictObject({
    content: z.string().min(1, { message: "Content is required" }).optional(),
  }),
};

export const PostIdSchema = {
  params: z.strictObject({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "invalid id" }),
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

export const DeletePostSchema = {
  params: z.strictObject({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "invalid id" }),
  }),
};

export const userIdSchema = {
  params: z.strictObject({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "invalid id" }),
  }),
};
