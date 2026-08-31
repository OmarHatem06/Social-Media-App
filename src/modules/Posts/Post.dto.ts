import z from "zod";
import type {
  CreatePostSchema,
  DeletePostSchema,
  PostIdSchema,
  UpdatePostSchema,
  userIdSchema,
} from "./Post.validation.js";
export type ICreatePostDTO = z.infer<typeof CreatePostSchema.body>;
export type IPostId = z.infer<typeof PostIdSchema.params>;
export type IUpdatePostDTO = z.infer<typeof UpdatePostSchema.body>;
export type IDeletePostDTO = z.infer<typeof DeletePostSchema.params>;
export type IuserPostDTO = z.infer<typeof userIdSchema.params>;
