import { deleteFile, saveFile } from "@/lib/file-s3";
import {
  CommentModel,
  EventModel,
  LikeModel,
  PostModel,
  UserModel,
} from "@/models";
import { GroupModel } from "@/models/group.model";
import { UserGroupsModel } from "@/models/usergroup.model";
import { Elysia, t } from "elysia";
import { Types } from "mongoose";

export const MyProfileController = new Elysia({
  prefix: "/myprofile",
  detail: {
    tags: ["Client - Users - My Profile"],
  },
})
  .get(
    "/commented-posts",
    async ({ query, set }) => {
      const { page = 1, limit = 10, userId } = query;

      if (!userId) {
        set.status = 400;
        return {
          message: "User ID is required",
          ok: false,
        };
      }

      try {
        const sanitizedPage = Math.max(1, page);
        const sanitizedLimit = Math.max(1, Math.min(limit, 20));

        const commentedPostIds = await CommentModel.aggregate([
          {
            $match: {
              user: new Types.ObjectId(userId),
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $group: {
              _id: "$post",
              latestComment: { $first: "$createdAt" },
            },
          },
          {
            $sort: { latestComment: -1 },
          },
          {
            $skip: (sanitizedPage - 1) * sanitizedLimit,
          },
          {
            $limit: sanitizedLimit,
          },
          {
            $project: {
              _id: 1,
            },
          },
        ]);

        if (commentedPostIds.length === 0) {
          return {
            commentedPosts: [],
            nextCursor: undefined,
            ok: true,
          };
        }

        const postIds = commentedPostIds.map((post) => post._id);

        const posts = await PostModel.aggregate([
          {
            $match: {
              _id: { $in: postIds },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "author",
              pipeline: [
                {
                  $match: {
                    active: true,
                  },
                },
                {
                  $project: {
                    name: 1,
                    email: 1,
                    image: 1,
                  },
                },
              ],
            },
          },
          {
            $match: { "author.0": { $exists: true } },
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

        const totalPosts = await CommentModel.countDocuments({
          user: new Types.ObjectId(userId),
        });
        const hasNextPage = sanitizedPage * sanitizedLimit < totalPosts;

        return {
          posts,
          nextCursor: hasNextPage ? sanitizedPage + 1 : undefined,
          ok: true,
          totalPosts,
        };
      } catch (error: any) {
        console.error(
          "Error fetching commented posts:",
          error.message || error
        );

        set.status = 500;
        return {
          message: "An internal error occurred while fetching commented posts.",
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
        userId: t.String(),
      }),
      detail: {
        description: "Get posts the user has commented on",
        summary: "Fetch user commented posts",
      },
    }
  )
  .get(
    "/favourite-posts",
    async ({ query, set }) => {
      const { page = 1, limit = 10, userId } = query;

      if (!userId) {
        set.status = 400;
        return {
          message: "User ID is required",
          ok: false,
        };
      }

      try {
        const sanitizedPage = Math.max(1, page);
        const sanitizedLimit = Math.max(1, Math.min(limit, 20));

        const LikesPostIds = await LikeModel.aggregate([
          {
            $match: {
              user: new Types.ObjectId(userId),
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $group: {
              _id: "$post",
              latestLike: { $first: "$createdAt" },
            },
          },
          {
            $sort: { latestLike: -1 },
          },
          {
            $skip: (sanitizedPage - 1) * sanitizedLimit,
          },
          {
            $limit: sanitizedLimit,
          },
          {
            $project: {
              _id: 1,
              latestLike: 1,
            },
          },
        ]);

        if (LikesPostIds.length === 0) {
          return {
            commentedPosts: [],
            nextCursor: undefined,
            ok: true,
          };
        }

        const postIds = LikesPostIds.map((post) => post._id);

        const posts = await PostModel.aggregate([
          {
            $match: {
              _id: { $in: postIds },
            },
          },
          {
            $addFields: {
              sortOrder: { $indexOfArray: [postIds, "$_id"] },
            },
          },
          {
            $sort: { sortOrder: 1 },
          },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "author",
              pipeline: [
                {
                  $match: {
                    active: true,
                  },
                },
                {
                  $project: {
                    name: 1,
                    email: 1,
                    image: 1,
                  },
                },
              ],
            },
          },
          {
            $match: { "author.0": { $exists: true } },
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

        const totalPosts = await CommentModel.countDocuments({
          user: new Types.ObjectId(userId),
        });
        const hasNextPage = sanitizedPage * sanitizedLimit < totalPosts;

        return {
          posts,
          nextCursor: hasNextPage ? sanitizedPage + 1 : undefined,
          ok: true,
          totalPosts,
        };
      } catch (error: any) {
        console.error(
          "Error fetching commented posts:",
          error.message || error
        );

        set.status = 500;
        return {
          message: "An internal error occurred while fetching commented posts.",
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
        userId: t.String(),
      }),
      detail: {
        description: "Get posts the user has Likes on",
        summary: "Fetch user Liked posts",
      },
    }
  )
  .get(
    "/created-posts",
    async ({ query, set }) => {
      const { page = 1, limit = 10, userId } = query;

      if (!userId) {
        set.status = 400;
        return {
          message: "User ID is required",
          ok: false,
        };
      }

      try {
        const sanitizedPage = Math.max(1, page);
        const sanitizedLimit = Math.max(1, Math.min(limit, 20));

        const totalPosts = await PostModel.countDocuments({
          author: new Types.ObjectId(userId),
        });

        if (totalPosts === 0) {
          return {
            posts: [],
            nextCursor: undefined,
            ok: true,
            totalPosts,
          };
        }

        const posts = await PostModel.aggregate([
          {
            $match: {
              author: new Types.ObjectId(userId),
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
                  $match: {
                    active: true,
                  },
                },
                {
                  $project: {
                    name: 1,
                    email: 1,
                    image: 1,
                  },
                },
              ],
            },
          },
          {
            $match: { "author.0": { $exists: true } },
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

        const hasNextPage = sanitizedPage * sanitizedLimit < totalPosts;

        return {
          posts,
          nextCursor: hasNextPage ? sanitizedPage + 1 : undefined,
          ok: true,
          totalPosts,
        };
      } catch (error: any) {
        console.error("Error fetching created posts:", error.message || error);

        set.status = 500;
        return {
          message: "An internal error occurred while fetching created posts.",
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
        userId: t.String(),
      }),
      detail: {
        description: "Get posts created by the user",
        summary: "Fetch user created posts",
      },
    }
  )
  .get(
    "/organised-events",
    async ({ set, query }) => {
      try {
        const { page, limit, userId } = query;

        const _page = Number(page) || 1;
        const _limit = Number(limit) || 10;

        const events = await EventModel.find({ managedBy: userId })
          .populate("group", "name slug")
          .sort({ createdAt: -1, _id: -1 })
          .skip((_page - 1) * _limit)
          .limit(_limit)
          .select("-unnecessaryField")
          .lean();

        set.status = 200;

        return {
          events,
          ok: true,
        };
      } catch (error: any) {
        console.log(error);
        set.status = 500;
        return {
          message: error,
        };
      }
    },
    {
      detail: {
        summary: "Organised Events ",
        description: "Get Organised Events",
      },
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        userId: t.String(),
      }),
    }
  )
  .get(
    "/participated-events",
    async ({ set, query }) => {
      try {
        const { page, limit, userId } = query;

        const _page = Number(page) || 1;
        const _limit = Number(limit) || 10;

        const events = await EventModel.find({
          attendees: {
            $in: [new Types.ObjectId(userId)],
          },
        })
          .populate("group", "name slug")
          .sort({ createdAt: -1, _id: -1 })
          .skip((_page - 1) * _limit)
          .limit(_limit)
          .select("-unnecessaryField")
          .lean();

        set.status = 200;

        return {
          events,
          ok: true,
        };
      } catch (error: any) {
        console.log(error);
        set.status = 500;
        return {
          message: error,
        };
      }
    },
    {
      detail: {
        summary: "Participated Events ",
        description: "Get Participated Events",
      },
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        userId: t.String(),
      }),
    }
  )
  .get(
    "/created-groups",
    async ({ set, query }) => {
      try {
        const { page, limit, userId } = query;

        const _page = Number(page) || 1;
        const _limit = Number(limit) || 10;

        const groups = await GroupModel.find({ groupAdmin: userId })
          .populate("groupAdmin", "name")
          .populate("subTopic", "slug")
          .sort({ createdAt: -1, _id: -1 })
          .skip((_page - 1) * _limit)
          .limit(_limit)
          .lean();

        set.status = 200;

        return {
          groups,
          ok: true,
        };
      } catch (error: any) {
        console.log(error);
        set.status = 500;
        return {
          message: error,
        };
      }
    },
    {
      detail: {
        summary: "created groups by  user",
        description: "created groups by user",
      },
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        userId: t.String(),
      }),
    }
  )
  .get(
    "/joined-groups",
    async ({ set, query }) => {
      try {
        const { page, limit, userId } = query;

        const _page = Number(page) || 1;
        const _limit = Number(limit) || 10;

        const groups = await UserGroupsModel.find({ userId: userId })
          .populate({
            path: "group",
            populate: {
              path: "groupAdmin",
              select: "name",
            },
          })
          .sort({ createdAt: -1, _id: -1 })
          .skip((_page - 1) * _limit)
          .limit(_limit)
          .lean();

        set.status = 200;

        return {
          groups,
          ok: true,
        };
      } catch (error: any) {
        console.log(error);
        set.status = 500;
        return {
          message: error,
        };
      }
    },
    {
      detail: {
        summary: "Joined groups by  user",
        description: "Joined groups by user",
      },
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        userId: t.String(),
      }),
    }
  )
  .put(
    "/edit-profile",
    async ({ set, query, body }) => {
      try {
        const { userId } = query;
        const { name, email, image } = body;
        const user = await UserModel.findById(userId);

        if (!user) {
          set.status = 400;
          return {
            message: "User Not found",
          };
        }

        user.name = name;
        user.email = email;

        let url = "";

        if (image) {
          const { ok, filename } = await saveFile(image, "profile-images");

          if (ok) {
            url = filename;
            deleteFile(user.image);
          } else {
            return {
              message: "Cant able to upload the image.",
              ok: false,
            };
          }
        }

        console.log(url);

        if (url) {
          user.image = url;
        }

        await user.save();

        set.status = 200;

        return {
          message: "User updated successfully",
          ok: true,
          image: user.image,
        };
      } catch (error: any) {
        console.log(error);
        set.status = 500;
        return {
          message: error,
        };
      }
    },
    {
      detail: {
        summary: "Edit User Profile",
        description: "Edit User Profile",
      },
      body: t.Object({
        name: t.String(),
        email: t.String(),
        image: t.Optional(t.File()),
      }),
    }
  );
