import { PostModel } from "@/models";
import { SubTopicModel } from "@/models/subtopicmodel";
import Elysia, { t } from "elysia";
import { Types } from "mongoose";

export const postController = new Elysia({
  prefix: "/post",
  detail: {
    description: "Post controller",
    tags: ["User - Post"],
    summary: "User Post Management",
  },
}).get(
  "/",
  async ({ query, set }) => {
    const { page = 1, limit = 5, userId } = query;

    try {
      const sanitizedPage = Math.max(1, page);
      const sanitizedLimit = Math.max(1, Math.min(limit, 20));

      const subTopic = await SubTopicModel.findOne({ slug: query.subTopic });

      if (!subTopic) {
        set.status = 404;
        return {
          message: "SubTopic not found",
          ok: false,
        };
      }

      const posts = await PostModel.aggregate([
        {
          $match: {
            subTopic: subTopic._id,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: (sanitizedPage - 1) * sanitizedLimit,
        },
        {
          $limit: sanitizedLimit,
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
            pipeline: [
              {
                $project: {
                  name: 1,
                  email: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "post",
            as: "likes",
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "post",
            as: "comments",
          },
        },
        ...(userId
          ? [
              {
                $lookup: {
                  from: "likes",
                  let: { postId: "$_id", userId: new Types.ObjectId(userId) },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$post", "$$postId"] },
                            { $eq: ["$user", "$$userId"] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "likedByMe",
                },
              },
            ]
          : []),
        {
          $project: {
            title: 1,
            description: 1,
            author: { $arrayElemAt: ["$author", 0] },
            createdAt: 1,
            likesCount: { $size: "$likes" },
            commentsCount: { $size: "$comments" },
            url: 1,
            image: 1,
            likedByMe: {
              $cond: {
                if: { $eq: [userId, null] },
                then: false,
                else: {
                  $gt: [{ $size: { $ifNull: ["$likedByMe", []] } }, 0],
                },
              },
            },
          },
        },
      ]);

      const totalPosts = await PostModel.countDocuments();
      const hasNextPage = sanitizedPage * sanitizedLimit < totalPosts;

      return {
        posts,
        nextCursor: hasNextPage ? sanitizedPage + 1 : undefined,
        ok: true,
      };
    } catch (error: any) {
      console.error("Error fetching posts:", error.message || error);

      set.status = 500;
      return {
        message: "An internal error occurred while fetching posts.",
        ok: false,
      };
    }
  },
  {
    query: t.Object({
      page: t.Optional(t.Number()),
      limit: t.Optional(t.Number()),
      userId: t.Optional(
        t.String({
          default: "",
        })
      ),
      subTopic: t.String({
        default: "",
      }),
    }),
    detail: {
      description: "Get posts",
      summary: "Get posts",
    },
  }
);
