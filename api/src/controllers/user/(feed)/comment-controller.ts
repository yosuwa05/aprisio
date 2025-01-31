import { CommentModel } from "@/models";
import Elysia, { t } from "elysia";
import { Types } from "mongoose";

export const commentsNoAuthController = new Elysia({
  prefix: "/comment",
  detail: {
    tags: ["User Comments - Noauth"],
    summary: "Get Comments",
  },
}).get(
  "/",
  async ({ query }) => {
    const { postId, userId } = query;

    try {
      const comments = await CommentModel.aggregate([
        { $match: { post: new Types.ObjectId(postId) } },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            user: { name: 1 },
            content: 1,
            parentComment: 1,
            likesCount: 1,
            likedBy: 1,
            createdAt: 1,
            updatedAt: 1,
            likedByMe: {
              $cond: {
                if: { $eq: [userId, null] },
                then: false,
                else: {
                  $in: [
                    new Types.ObjectId(userId),
                    { $ifNull: ["$likedBy", []] },
                  ],
                },
              },
            },
          },
        },
      ]);

      return {
        comments,
        ok: true,
      };
    } catch (error) {
      console.error("Error fetching comments:", error);
      return {
        message: "An error occurred while fetching comments.",
        ok: false,
      };
    }
  },
  {
    query: t.Object({
      postId: t.String(),
      userId: t.Optional(
        t.Any({
          default: null,
        })
      ),
    }),
    detail: {
      description: "Get comments for a post",
      summary: "Get comments for a post",
    },
  }
);
