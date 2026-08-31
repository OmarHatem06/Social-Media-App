import { z } from "zod";
export const friendRequestSchema = {
  params: z.strictObject({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "invalid id" }),
  }),
};

export const RequestSchema = {
  params: z.strictObject({
    requestId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "invalid id" }),
  }),
};

export const SearchUsersSchema = {
  query: z.strictObject({
    search: z.string(),
  }),
};
