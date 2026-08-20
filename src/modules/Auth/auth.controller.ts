import authService from "./auth.service.js";
import Router from "express";
import {
  ConfirmEmailSchema,
  LoginSchema,
  SignUpSchema,
} from "./auth.validation.js";
import { Validation } from "../../Middlewares/Validation.middlewares.js";

const router = Router();
export default router;

router.post("/signup", Validation(SignUpSchema), authService.signUp);
router.post(
  "/confirm-email",
  Validation(ConfirmEmailSchema),
  authService.ConfirmEmail,
);
router.post("/login", Validation(LoginSchema), authService.login);
