import Router from "express";
import { FriendRequestSchema } from "../../DB/models/friendRequests.model.js";
import { Validation } from "../../Middlewares/Validation.middlewares.js";
import {
  friendRequestSchema,
  RequestSchema,
  SearchUsersSchema,
} from "./user.validation.js";
import UserService from "./user.service.js";
import { Authentication } from "../../Middlewares/Authentication.middleware.js";
import { TokenTypeEnum } from "../../Utils/enums/user.enums.js";
import userService from "./user.service.js";
import { userIdSchema } from "../Posts/Post.validation.js";

const router = Router();
export default router;
router.use(Authentication({ TokenType: TokenTypeEnum.ACCESS }));
router.post(
  "/friend-request/:userId",
  Validation(friendRequestSchema),
  UserService.friendRequest,
);

router.post(
  "/accept-friend-request/:requestId",
  Validation(RequestSchema),
  UserService.acceptFriendRequest,
);
router.post(
  "/reject-friend-request/:requestId",
  Validation(RequestSchema),
  UserService.rejectFriendRequest,
);

router.get("/friend-requests/get", userService.getRequest);
router.post(
  "/friends/remove/:userId",
  Validation(userIdSchema),
  userService.removeFriends,
);
router.patch("/block/:userId", Validation(userIdSchema), UserService.blockUser);
router.patch(
  "/unblock/:userId",
  Validation(userIdSchema),
  UserService.unblockUser,
);
router.get("/get", Validation(SearchUsersSchema), UserService.searchUser);
