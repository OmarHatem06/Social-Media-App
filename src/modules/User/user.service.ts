import type { Request, Response } from "express";
import type { FriendReqDTO, ReqDTO, searchDTo } from "./user.dto.js";
import { FriendRequestModel } from "../../DB/models/friendRequests.model.js";
import { UserModel } from "../../DB/models/User.model.js";
import { BadRequestException } from "../../Utils/responses/error.response.js";
import { string } from "zod";
import type { IuserPostDTO } from "../Posts/Post.dto.js";

class UserService {
  constructor() {}

  friendRequest = async (req: Request, res: Response) => {
    const { userId }: FriendReqDTO = req.params as { userId: string };
    const To = await UserModel.findOne({
      _id: userId,
    });

    if (!To || userId === String(req.user!._id)) {
      throw new BadRequestException("could not find this User");
    }
    if (req.user!.blockedUsers?.some((id) => id.equals(To._id))) {
      throw new BadRequestException("you blocked this user");
    }
    if (req.user!.blockedBy?.some((id) => id.equals(To._id))) {
      throw new BadRequestException("you are blocked by this user");
    }
    const request = await FriendRequestModel.findOne({
      SendFrom: req.user!._id,
      SendTo: To._id,
    });
    if (request) throw new BadRequestException("request already sent");
    const send = await FriendRequestModel.create({
      SendFrom: req.user!._id,
      SendTo: To._id,
    });

    return res.status(200).json({ message: "request sent successfully" });
  };

  acceptFriendRequest = async (req: Request, res: Response) => {
    const { requestId }: ReqDTO = req.params as { requestId: string };
    const request = await FriendRequestModel.findOne({
      _id: requestId,
      SendTo: req.user!._id,
    });
    if (!request) throw new BadRequestException("cannot find his request");

    await UserModel.updateOne(
      { _id: req.user!._id },
      {
        $push: { friends: request.SendFrom },
      },
    );
    await UserModel.updateOne(
      { _id: request.SendFrom },
      {
        $addToSet: { friends: request.SendTo },
      },
    );

    await FriendRequestModel.deleteOne({ _id: requestId });
    return res.status(200).json({ message: "friend request accepted" });
  };
  rejectFriendRequest = async (req: Request, res: Response) => {
    const { requestId }: ReqDTO = req.params as { requestId: string };
    const request = await FriendRequestModel.findOneAndDelete({
      _id: requestId,
      $or: [{ SendTo: req.user!._id }, { SendFrom: req.user!._id }],
    });
    if (!request) throw new BadRequestException("cannot found the request");
    return res
      .status(200)
      .json({ message: "friend request rejected successfully" });
  };
  getRequest = async (req: Request, res: Response) => {
    const request = await FriendRequestModel.find({
      SendTo: req.user!._id,
    })
      .select("-SendTo")
      .populate("SendFrom", "firstname lastname email");
    if (request.length === 0) {
      return res.status(200).json({ data: "[]", message: "no requests found" });
    }
    return res.status(200).json({ data: request });
  };

  removeFriends = async (req: Request, res: Response) => {
    const { userId }: IuserPostDTO = req.params as { userId: string };
    const myId = req.user!._id;
    if (!userId) throw new BadRequestException("user not found");
    await Promise.all([
      UserModel.updateOne({ _id: userId }, { $pull: { friends: myId } }),
      UserModel.updateOne(
        { _id: myId },
        {
          $pull: { friends: userId },
        },
      ),
    ]);

    return res.status(200).json({ message: "friend is removed successfuly" });
  };

  blockUser = async (req: Request, res: Response) => {
    const { userId }: IuserPostDTO = req.params as { userId: string };
    const TargetUser = await UserModel.findById(userId);
    const me = await UserModel.findById(req.user!._id);
    if (!TargetUser) throw new BadRequestException("cannot find user");
    if (TargetUser._id.equals(req.user!._id))
      throw new BadRequestException("u cannot block yourself");

    const alreadyblocked = me!.blockedUsers?.some((id) =>
      id.equals(TargetUser._id),
    );
    if (alreadyblocked)
      throw new BadRequestException("user already is blocked");
    if (me!.blockedBy?.some((id) => id.equals(TargetUser._id))) {
      throw new BadRequestException(
        "he blocked you first u cannot block him back",
      );
    }

    await Promise.all([
      UserModel.updateOne(
        { _id: req.user!._id },
        {
          $pull: { friends: TargetUser._id },
          $addToSet: { blockedUsers: TargetUser._id },
        },
      ),
      UserModel.updateOne(
        { _id: TargetUser._id },
        {
          $pull: { friends: req.user!._id },
          $addToSet: { blockedBy: req.user!._id },
        },
      ),
    ]);

    return res.status(200).json({ message: "user blocked successfully" });
  };

  unblockUser = async (req: Request, res: Response) => {
    const { userId }: IuserPostDTO = req.params as { userId: string };
    const TargetUser = await UserModel.findById(userId);
    if (req.user!.blockedBy?.some((id) => id.equals(TargetUser?._id))) {
      throw new BadRequestException("User Blocked u first -_-");
    }
    if (TargetUser!._id.equals(req.user!._id))
      throw new BadRequestException("u cannot unblock yourself");
    if (!req.user!.blockedUsers?.some((id) => id.equals(TargetUser?._id))) {
      throw new BadRequestException("you did not block this user before");
    }

    const unblock = await Promise.all([
      UserModel.updateOne(
        { _id: req.user!._id },
        {
          $pull: { blockedUsers: userId },
        },
      ),
      UserModel.updateOne(
        { _id: userId },
        {
          $pull: { blockedBy: req.user?._id },
        },
      ),
    ]);
    return res.status(200).json({ message: "Unblocked successfuly" });
  };
  searchUser = async (req: Request, res: Response) => {
    const { search }: searchDTo = req.query as { search: string };
    const users = await UserModel.find({
      username: { $regex: search, $options: "i" },
      _id: { $nin: req.user!.blockedBy && req.user!.blockedUsers },
    });
    if (users.length == 0)
      return res.status(404).json({ message: "user not found" });
    return res.status(200).json({ data: users });
  };
}
export default new UserService();
