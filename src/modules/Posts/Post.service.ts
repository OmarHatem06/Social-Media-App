import { PostModel } from "../../DB/models/Post.model.js";
import { BadRequestException } from "../../Utils/responses/error.response.js";
import type {
  ICreatePostDTO,
  IDeletePostDTO,
  IUpdatePostDTO,
  IuserPostDTO,
} from "./Post.dto.js";
import type { Request, Response } from "express";
import type { IPostId } from "./Post.dto.js";
class PostService {
  constructor() {}
  createPost = async (req: Request, res: Response) => {
    const { content }: ICreatePostDTO = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    if (!content && !files?.length) {
      throw new BadRequestException("u have to post something");
    }
    const create = await PostModel.create({
      ...(content && { content }),
      ...(files?.length && {
        attachments: files.map((file) => file.path),
      }),
      createdBy: req.user!._id,
    });
    return res.status(201).json({
      message: "Post created successfully",
      post: create,
    });
  };
  likePost = async (req: Request, res: Response) => {
    const { postId }: IPostId = req.params as { postId: string };
    const userId = req.user!._id;
    const post = await PostModel.findOne({
      _id: postId,
      freezedAt: { $exists: false },
    });
    if (!post) {
      throw new BadRequestException("post not found or freezed");
    }
    const alreadyLiked = post.likes?.some((id) => id.equals(userId));
    const updatelike = await PostModel.findByIdAndUpdate(
      postId,
      alreadyLiked
        ? {
            $pull: { likes: userId },
          }
        : { $addToSet: { likes: userId } },
      { new: true },
    );

    return res
      .status(200)
      .json({ message: alreadyLiked ? "unliked" : "liked", data: updatelike });
  };

  updatePost = async (req: Request, res: Response) => {
    const { postId }: IPostId = req.params as { postId: string };
    const { content }: IUpdatePostDTO = req.body;
    const post = await PostModel.findOneAndUpdate(
      {
        CreatedBy: req.user!._id,
        _id: postId,
      },
      { content, $inc: { __v: 1 } },
      { new: true },
    );
    if (!post)
      throw new BadRequestException("post not found or user not authorized");

    return res.status(200).json({ message: "post is updated", data: post });
  };

  deletePost = async (req: Request, res: Response) => {
    const { postId }: IDeletePostDTO = req.params as { postId: string };
    const deleted = await PostModel.deleteOne({
      _id: postId,
      CreatedBy: req.user!._id,
    });

    if (!deleted)
      throw new BadRequestException("cannot find post or not authorized");

    return res.status(200).json({ message: "post deleted successfully" });
  };

  getPosts = async (req: Request, res: Response) => {
    const { postId }: IDeletePostDTO = req.params as { postId: string };

    const post = await PostModel.findOne({ _id: postId }).populate(
      "CreatedBy",
      "firstname lastname email",
    );
    return res.status(200).json({ data: post });
  };

  getProfilePosts = async (req: Request, res: Response) => {
    const { userId }: IuserPostDTO = req.params as { userId: string };
    const posts = await PostModel.find({ CreatedBy: userId }).populate(
      "CreatedBy",
      "firstname lastname email friends",
    );
    return res.status(200).json({ data: posts });
  };

  getallPosts = async (req: Request, res: Response) => {
    const posts = await PostModel.find({
      createdBy: {
        $nin: [
          ...(req.user!.blockedBy ?? []),
          ...(req.user!.blockedUsers ?? []),
        ],
      },
    }).populate("createdBy", "email firstname lastname");
    if (posts.length == 0)
      return res.status(404).json({ message: "Nothing on your feed" });
    return res.status(200).json(posts);
  };
}

export default new PostService();
