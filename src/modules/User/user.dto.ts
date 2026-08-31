import z from "zod";
import type {
  friendRequestSchema,
  RequestSchema,
  SearchUsersSchema,
} from "./user.validation.js";

export type FriendReqDTO = z.infer<typeof friendRequestSchema.params>;
export type ReqDTO = z.infer<typeof RequestSchema.params>;
export type searchDTo = z.infer<typeof SearchUsersSchema.query>;
