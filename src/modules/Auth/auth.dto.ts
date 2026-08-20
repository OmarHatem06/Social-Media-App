import z from "zod";
import {
  ConfirmEmailSchema,
  LoginSchema,
  SignUpSchema,
} from "./auth.validation.js";
export type ISignUpDTO = z.infer<typeof SignUpSchema.body>;
export type IConfirmEmailDTO = z.infer<typeof ConfirmEmailSchema.body>;
export type ILogin = z.infer<typeof LoginSchema.body>;
