import { CommentModel, EventModel, PostModel } from "@/models";
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

                const totalPosts = await CommentModel.countDocuments({ user: new Types.ObjectId(userId) });
                const hasNextPage = sanitizedPage * sanitizedLimit < totalPosts;

                return {
                    posts,
                    nextCursor: hasNextPage ? sanitizedPage + 1 : undefined,
                    ok: true,
                    totalPosts,
                };
            } catch (error: any) {
                console.error("Error fetching commented posts:", error.message || error);

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

                // Get total count of posts created by the user
                const totalPosts = await PostModel.countDocuments({ author: new Types.ObjectId(userId) });

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
                        $sort: { createdAt: -1 }, // Sort by latest created post first
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
    .get("/organised-events", async ({ set, query }) => {
        try {
            const { page, limit, userId } = query;

            const _page = Number(page) || 1
            const _limit = Number(limit) || 10

            const events = await EventModel.find({ managedBy: userId })
                .sort({ createdAt: -1, _id: -1 })
                .skip((_page - 1) * _limit)
                .limit(_limit)
                .select("-unnecessaryField")
                .lean();

            set.status = 200

            return {
                events,
                ok: true,
            };

        } catch (error: any) {
            console.log(error)
            set.status = 500
            return {
                message: error
            }
        }
    }, {
        detail: {
            summary: "Organised Events ",
            description: "Get Organised Events"
        },
        query: t.Object({
            page: t.Optional(t.String()),
            limit: t.Optional(t.String()),
            userId: t.String()
        })
    })


