import z from "zod";
import type {
  CreateCommentSchema,
  DeleteCommentSchema,
  DeletePostSchema,
  PostIdSchema,
  UpdateCommentSchema,
  UpdatePostSchema,
  userIdSchema,
} from "./Comments.validation.js";
export type ICreateCommentDTO = z.infer<typeof CreateCommentSchema.body>;
export type ICommentPostId = z.infer<typeof CreateCommentSchema.params>;
export type IPostId = z.infer<typeof PostIdSchema.params>;
export type IUpdatePostDTO = z.infer<typeof UpdatePostSchema.body>;
export type IDeletePostDTO = z.infer<typeof DeletePostSchema.params>;
export type IuserPostDTO = z.infer<typeof userIdSchema.params>;
export type ICommentUpdateId = z.infer<typeof UpdateCommentSchema.params>;
export type ICommentUpdateContent = z.infer<typeof UpdateCommentSchema.body>;
export type IDeleteCommentId = z.infer<typeof DeleteCommentSchema.params>;
