import Router from "express";
import {
  CreateCommentSchema,
  DeleteCommentSchema,
  UpdateCommentSchema,
} from "./Comments.validation.js";
import { Validation } from "../../Middlewares/Validation.middlewares.js";
import CommentsService from "./Comments.service.js";
import { Authentication } from "../../Middlewares/Authentication.middleware.js";
import { TokenTypeEnum } from "../../Utils/enums/user.enums.js";
import { localFileUpload } from "../../Utils/multer/multer.js";
import { fileValidator } from "../../Utils/multer/multer.js";
const router = Router();

export default router;
router.use(Authentication({ TokenType: TokenTypeEnum.ACCESS }));
router.post(
  "/create/:postId",
  localFileUpload({
    validation: fileValidator.image,
    customPath: "comments",
  }).array("attachments", 10),

  Validation(CreateCommentSchema),
  CommentsService.createComment,
);
router.patch(
  "/update/:CommentId",
  Validation(UpdateCommentSchema),
  CommentsService.updateComment,
);

router.delete(
  "/delete/:CommentId",
  Validation(DeleteCommentSchema),
  CommentsService.deleteComment,
);
