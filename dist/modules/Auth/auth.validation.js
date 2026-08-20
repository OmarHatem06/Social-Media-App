import { z } from "zod";
export const LoginSchema = {
    body: z.strictObject({
        email: z.email({ error: "invalid email address" }),
        password: z
            .string()
            .min(8, { error: "minimum is 8" })
            .max(20, { error: "maximum is 20" }),
    }),
};
export const SignUpSchema = {
    body: LoginSchema.body
        .extend({
        username: z
            .string({ error: "username has to be  string" })
            .min(2, { error: "minimum 2 letters" })
            .max(25, { error: "maximum 15 letters" }),
        ConfirmPassword: z
            .string()
            .min(8, { error: "minimum is 8" })
            .max(20, { error: "maximum is 20" }),
        Role: z.enum(["USER", "ADMIN"]).default("USER"),
        Gender: z.enum(["MALE", "FEMALE"]).default("MALE"),
    })
        .superRefine((data, ctx) => {
        if (data.password !== data.ConfirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["Confirm Password"],
                message: "password mismatch",
            });
        }
    }),
};
export const ConfirmEmailSchema = {
    body: z.strictObject({
        email: z.email({ error: "invalid email address" }),
        otp: z.string().regex(/^\d{6}$/),
    }),
};
