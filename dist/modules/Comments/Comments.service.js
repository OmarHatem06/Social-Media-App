import { PostModel } from "../../DB/models/Post.model.js";
import { BadRequestException } from "../../Utils/responses/error.response.js";
import { CommentsModel } from "../../DB/models/Comments.model.js";
class CommentService {
    constructor() { }
    createComment = async (req, res) => {
        const { postId } = req.params;
        const { content, parentId } = req.body;
        const files = req.files;
        const post = await PostModel.findById(postId);
        if (!post)
            throw new BadRequestException("Post not found");
        if (parentId) {
            const parent = await CommentsModel.findById(parentId);
            if (!parent)
                throw new BadRequestException("comment not  found");
        }
        const create = await CommentsModel.create({
            postId,
            ...(parentId && { parentId }),
            ...(files?.length && {
                attachments: files.map((file) => file.path),
            }),
            content,
            createdBy: req.user._id,
        });
        return res
            .status(200)
            .json({ message: "comment is created successfully", data: create });
    };
    updateComment = async (req, res) => {
        const { content } = req.body;
        const { CommentId } = req.params;
        const comment = await CommentsModel.findById(CommentId);
        if (!comment)
            throw new BadRequestException("comment not found");
        if (!comment.createdBy.equals(req.user._id)) {
            throw new BadRequestException("u are not authorized to edit this comment");
        }
        const updatecomment = await CommentsModel.updateOne({ _id: CommentId, createdBy: req.user._id }, {
            content,
            $inc: { __v: 1 },
        });
        return res
            .status(200)
            .json({ message: "updated successfully", updatecomment });
    };
    deleteComment = async (req, res) => {
        const { CommentId } = req.params;
        const comment = await CommentsModel.findById(CommentId);
        const post = await PostModel.findById(comment?.postId);
        if (!comment)
            throw new BadRequestException("comment not found");
        if (!comment.createdBy.equals(req.user._id) &&
            !post?.createdBy.equals(req.user._id)) {
            throw new BadRequestException("u are not authorized to delete this comment");
        }
        const DeleteComment = await CommentsModel.deleteOne({ _id: CommentId });
        return res.status(200).json({ message: "deleted succesfully" });
    };
}
export default new CommentService();
