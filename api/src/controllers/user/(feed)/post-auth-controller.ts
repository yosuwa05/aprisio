import { slugify } from "@/lib/utils";
import { LikeModel, PostModel } from "@/models";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";
import { Types } from "mongoose";

export const authenticatedPostController = new Elysia({
  prefix: "/authenticated/post",
  detail: {
    description: "Post controller",
    tags: ["User - Post - (Auth)"],
  },
})
  .get(
    "/",
    async ({ query, set, store }) => {
      const { page = 1, limit = 10 } = query;

      try {
        const userId = (store as StoreType)["id"] || "";

        const sanitizedPage = Math.max(1, page);
        const sanitizedLimit = Math.max(1, Math.min(limit, 100));

        const posts = await PostModel.aggregate([
          {
            $match: {},
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
          nextCursor: hasNextPage ? sanitizedPage + 1 : null,
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
      }),
      detail: {
        description: "Get posts",
        summary: "Get posts",
      },
    }
  )
  .post(
    "/create",
    async ({ body, set, store }) => {
      const { title, description } = body;

      try {
        const userId = (store as StoreType)["id"];

        if (!userId) {
          set.status = 401;
          return {
            message: "Unauthorized",
            ok: false,
          };
        }

        if (!title || !description) {
          set.status = 400;
          return {
            message: "Title and description are required.",
            ok: false,
          };
        }

        if (title.length > 100) {
          set.status = 400;
          return {
            message: "Title is too long. Max length is 100 characters.",
            ok: false,
          };
        }

        let slug = slugify(title);
        const existingPost = await PostModel.findOne({ title });

        if (existingPost) {
          return {
            message: "Duplicate entry. Title already exists.",
            ok: false,
          };
        }

        const newPost = new PostModel({
          title,
          description,
          slug: slugify(title),
          author: userId,
        });

        await newPost.save();

        set.status = 200;
        return { message: "Post created successfully", ok: true };
      } catch (error: any) {
        set.status = 500;
        return {
          message: "An internal error occurred while processing the post.",
          ok: false,
        };
      }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
      }),
      detail: {
        description: "Create post",
        summary: "Create post",
      },
    }
  )
  .post(
    "/like",
    async ({ body, set, store }) => {
      const { postId } = body;

      try {
        const userId = (store as StoreType)["id"];

        const existingLike = await LikeModel.findOne({
          user: userId,
          post: postId,
        });

        if (existingLike) {
          await LikeModel.deleteOne({ _id: existingLike._id });

          await PostModel.findByIdAndUpdate(postId, {
            $inc: { likesCount: -1 },
          });

          set.status = 200;
          return { message: "Post unliked successfully", ok: true };
        }

        const newLike = new LikeModel({
          user: userId,
          post: postId,
        });

        await newLike.save();

        await PostModel.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

        set.status = 200;
        return { message: "Post liked successfully", ok: true };
      } catch (error: any) {
        console.error("Error liking/unliking post:", error);

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
        postId: t.String(),
      }),
      detail: {
        description: "Like or unlike post",
        summary: "Like or unlike post",
      },
    }
  );
