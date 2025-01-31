import { CommentModel, PostModel } from "@/models";
import { CommentLikeModel } from "@/models/commentlikes";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";

export const commentsController = new Elysia({
  prefix: "/comment",
  detail: {
    tags: ["User Comment"],
    summary: "Post Comments",
  },
})
  .post(
    "/",
    async ({ body, set, store }) => {
      const { postId, content, parentCommentId } = body;

      try {
        const userId = (store as StoreType)["id"];

        const newComment = new CommentModel({
          user: userId,
          post: postId,
          content,
          parentComment: parentCommentId || null,
        });

        await newComment.save();

        await PostModel.findByIdAndUpdate(postId, {
          $inc: { commentsCount: 1 },
        });

        set.status = 201;
        return {
          message: "Comment added successfully",
          ok: true,
          comment: newComment,
        };
      } catch (error: any) {
        console.error("Error adding comment:", error);
        set.status = 500;
        return {
          message: "An error occurred while adding the comment.",
          ok: false,
        };
      }
    },
    {
      body: t.Object({
        postId: t.String(),
        content: t.String(),
        parentCommentId: t.Optional(t.String()),
      }),
      detail: { description: "Add a comment", summary: "Add a comment" },
    }
  )
  .post(
    "/like",
    async ({ body, set, store }) => {
      const { commentId } = body;

      try {
        const userId = (store as StoreType)["id"];

        const session = await CommentLikeModel.startSession();
        session.startTransaction();

        try {
          const existingLike = await CommentLikeModel.findOne({
            user: userId,
            comment: commentId,
          }).session(session);

          if (existingLike) {
            await CommentLikeModel.deleteOne({ _id: existingLike._id }).session(
              session
            );
            await CommentModel.findByIdAndUpdate(
              commentId,
              {
                $inc: { likesCount: -1 },
                $pull: { likedBy: userId },
              },
              { session }
            ).exec();
            await session.commitTransaction();
            session.endSession();

            set.status = 200;
            return { message: "Comment unliked", ok: true };
          }

          const newLike = new CommentLikeModel({
            user: userId,
            comment: commentId,
          });
          await newLike.save({ session });
          await CommentModel.findByIdAndUpdate(
            commentId,
            {
              $inc: { likesCount: 1 },
              $addToSet: { likedBy: userId },
            },
            { session }
          ).exec();
          await session.commitTransaction();
          session.endSession();

          set.status = 200;
          return { message: "Comment liked", ok: true };
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          throw error;
        }
      } catch (error: any) {
        console.error("Error liking/unliking comment:", error);

        set.status = 500;
        return {
          message:
            "An internal error occurred while processing the like/unlike.",
          ok: false,
        };
      }
    },
    {
      body: t.Object({
        commentId: t.String(),
      }),
      detail: {
        description: "Like or unlike comment",
        summary: "Like or unlike comment",
      },
    }
  );
