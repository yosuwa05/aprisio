import { EventCommentModel } from "@/models/event-comments";
import Elysia, { t } from "elysia";
import { Types } from "mongoose";

export const EventsCommentNoAuthController = new Elysia({
  prefix: "/event-comment",
  detail: {
    tags: ["Event Comment No Auth"],
  },
}).get(
  "/",
  async ({ query }) => {
    let { eventId, userId, page, limit } = query;

    const _page = Number(page) || 1;
    const _limit = Number(limit) || 10;

    try {
      if (!userId) userId = null;

      const comments = await EventCommentModel.aggregate([
        { $match: { event: new Types.ObjectId(eventId) } },
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
          $lookup: {
            from: "eventcomments",
            localField: "parentComment",
            foreignField: "_id",
            as: "parentComment",
          },
        },
        {
          $unwind: { path: "$parentComment", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "users",
            localField: "parentComment.user",
            foreignField: "_id",
            as: "parentComment.user",
          },
        },
        {
          $unwind: {
            path: "$parentComment.user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            user: { name: 1, image: 1 },
            content: 1,
            parentComment: {
              _id: 1,
              user: { name: 1, image: 1 },
              content: 1,
              likesCount: 1,
              likedBy: 1,
              createdAt: 1,
              updatedAt: 1,
            },
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
        { $skip: (_page - 1) * _limit },
        { $limit: _limit },
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
      eventId: t.String(),
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      userId: t.Optional(
        t.Any({
          default: null,
        })
      ),
    }),
    detail: {
      description: "Get comments for a Event",
      summary: "Get comments for a Event",
    },
  }
);
