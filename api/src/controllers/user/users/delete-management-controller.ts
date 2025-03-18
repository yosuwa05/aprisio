import { CommentModel, LikeModel, PostModel } from "@/models";
import { CommentLikeModel } from "@/models/commentlikes";
import { GroupPostShareModel } from "@/models/grouppostshare";
import Elysia, { t } from "elysia";

export const DeleteManagementController = new Elysia({
    prefix: "/delete-management",
    detail: {
        tags: ["Client - Users - Delete Management"],
    },
})

    .delete("/post", async ({ set, query }) => {
        try {
            const { postId } = query;

            const isPostExist = await PostModel.findById(postId);
            if (!isPostExist) {
                set.status = 400;
                return { message: "Post not found" };
            }

            const comments = await CommentModel.find({ post: postId });

            const commentIds = comments.map(comment => comment._id);

            if (commentIds.length > 0) {
                await CommentLikeModel.deleteMany({ comment: { $in: commentIds } });
                await CommentModel.deleteMany({ parentComment: { $in: commentIds } });
                await CommentModel.deleteMany({ post: postId });
            }

            await LikeModel.deleteMany({ post: postId });
            await GroupPostShareModel.deleteMany({ postId });

            await PostModel.findByIdAndDelete(postId);

            set.status = 200;
            return { message: "Post deleted successfully" };

        } catch (error: any) {
            console.log(error);
            set.status = 500;
            return { message: error.message };
        }
    }, {
        query: t.Object({
            postId: t.String()
        }),
        detail: {
            summary: "Delete post",
            description: "Deletes a post "
        }
    });
