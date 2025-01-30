import { CommentModel, PostModel } from "@/models";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";

export const commentsController = new Elysia({
  prefix: "/comment",
  detail: {
    tags: ["User Comment"],
    summary: "Post Comments",
  },
}).post(
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
);
