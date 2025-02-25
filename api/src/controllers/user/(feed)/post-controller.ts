import { PostModel, UserModel } from "@/models";
import { GroupModel } from "@/models/group.model";
import { SubTopicModel } from "@/models/subtopicmodel";
import { UserSubTopicModel } from "@/models/usersubtopic.model";
import Elysia, { t } from "elysia";
import { Types } from "mongoose";

export const postController = new Elysia({
  prefix: "/post",
  detail: {
    description: "Post controller",
    tags: ["User - Post"],
    summary: "User Post Management",
  },
})
  .get(
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
  )
  .get(
    "/personal",
    async ({ query, set }) => {
      const { page = 1, limit = 5, userId } = query;

      try {
        const sanitizedPage = Math.max(1, page);
        const sanitizedLimit = Math.max(1, Math.min(limit, 20));

        const userJoinedSubtopics = await UserSubTopicModel.find(
          {
            userId: userId,
          },
          "subTopicId"
        );

        if (!userJoinedSubtopics || userJoinedSubtopics.length === 0) {
          set.status = 404;
          return {
            message: "User has not joined any subtopics",
            ok: false,
          };
        }

        const subTopicIds = userJoinedSubtopics.map(
          (subTopic) => subTopic.subTopicId
        );

        const posts = await PostModel.aggregate([
          {
            $match: {
              subTopic: { $in: subTopicIds },
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
          {
            $lookup: {
              from: "groups",
              localField: "group",
              foreignField: "_id",
              as: "group",
              pipeline: [
                {
                  $project: {
                    name: 1,
                    slug: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "subtopics",
              localField: "subTopic",
              foreignField: "_id",
              as: "subTopic",
              pipeline: [
                {
                  $project: {
                    subTopicName: 1,
                    slug: 1,
                  },
                },
              ],
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
              subTopic: 1,
              group: 1,
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

        const totalPosts = await PostModel.countDocuments({
          subTopic: { $in: subTopicIds },
        });
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
        createdByMe: t.Boolean({
          default: false,
        }),
      }),
      detail: {
        description: "Get personal posts",
        summary: "Get personal posts",
      },
    }
  )
  .get(
    "/personalprofile",
    async ({ query, set }) => {
      const { page = 1, limit = 5, userId } = query;

      try {
        const sanitizedPage = Math.max(1, page);
        const sanitizedLimit = Math.max(1, Math.min(limit, 20));

        const user = await UserModel.findOne({
          name: userId,
        });

        if (!user) {
          set.status = 404;
          return {
            message: "User not found",
            ok: false,
          };
        }

        const posts = await PostModel.aggregate([
          {
            $match: { author: new Types.ObjectId(user._id) },
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
                    let: {
                      postId: "$_id",
                      userId: new Types.ObjectId(user._id),
                    },
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
                  if: { $eq: [user._id, null] },
                  then: false,
                  else: {
                    $gt: [{ $size: { $ifNull: ["$likedByMe", []] } }, 0],
                  },
                },
              },
            },
          },
        ]);

        const totalPosts = await PostModel.countDocuments({
          author: new Types.ObjectId(user._id),
        });
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
        createdByMe: t.Boolean({
          default: false,
        }),
      }),
      detail: {
        description: "Get posts posted by user",
        summary: "Get posts posted by user",
      },
    }
  )
  .get(
    "/group",
    async ({ query, set }) => {
      const { page = 1, limit = 5, userId, groupid } = query;

      try {
        const sanitizedPage = Math.max(1, page);
        const sanitizedLimit = Math.max(1, Math.min(limit, 20));

        const group = await GroupModel.findOne({ slug: groupid });

        if (!group) {
          return {
            ok: false,
            message: "Group not found",
          };
        }

        const posts = await PostModel.aggregate([
          {
            $match: {
              group: new Types.ObjectId(group._id),
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

        const totalPosts = await PostModel.countDocuments({
          group: { $in: [group._id, null] },
        });
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
        groupid: t.Optional(
          t.String({
            default: "",
          })
        ),
      }),
      detail: {
        description: "Get personal posts",
        summary: "Get personal posts",
      },
    }
  );
