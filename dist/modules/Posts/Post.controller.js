import Router from "express";
import { Authentication } from "../../Middlewares/Authentication.middleware.js";
import { TokenTypeEnum } from "../../Utils/enums/user.enums.js";
import PostService from "./Post.service.js";
import { fileValidator, localFileUpload } from "../../Utils/multer/multer.js";
import { Validation } from "../../Middlewares/Validation.middlewares.js";
import { DeletePostSchema, PostIdSchema, UpdatePostSchema, } from "./Post.validation.js";
const router = Router();
router.use(Authentication({ TokenType: TokenTypeEnum.ACCESS }));
export default router;
router.post("/create_post", localFileUpload({
    validation: fileValidator.image,
    customPath: "posts",
}).array("attachments", 10), PostService.createPost);
router.post("/:postId/like", Validation(PostIdSchema), PostService.likePost);
router.patch("/:postId/update", Validation(UpdatePostSchema), PostService.updatePost);
router.delete("/:postId/delete", Validation(DeletePostSchema), PostService.deletePost);
router.get("/:postId/get", PostService.getPosts);
router.get("/get/:userId", PostService.getProfilePosts);
router.get("/get", PostService.getallPosts);
