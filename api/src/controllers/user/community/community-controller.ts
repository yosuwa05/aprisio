import { GroupModel } from "@/models/group.model";
import { SubTopicModel } from "@/models/subtopicmodel";
import { TopicModel } from "@/models/topicsmodel";
import { UserGroupsModel } from "@/models/usergroup.model";
import { UserSubTopicModel } from "@/models/usersubtopic.model";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";
import { Types } from "mongoose";

export const communityController = new Elysia({
  prefix: "/community",
  tags: ["User - Community"],
})

  // .get(
  //   "/",
  //   async ({ query }) => {
  //     try {
  //       const { ObjectId } = require("mongoose").Types;

  //       const page = query.page || 1;
  //       const limit = query.limit || 10;
  //       const { userId, topicName } = query;

  //       const aggregationPipeline: any = [];

  //       if (topicName && topicName.trim() !== "") {
  //         aggregationPipeline.push({
  //           $match: {
  //             topicName: { $regex: topicName, $options: "i" },
  //           },
  //         });
  //       }

  //       aggregationPipeline.push(
  //         { $sort: { createdAt: -1, _id: -1 } },
  //         { $skip: (page - 1) * limit },
  //         { $limit: limit },
  //         {
  //           $lookup: {
  //             from: "subtopics",
  //             localField: "_id",
  //             foreignField: "topic",
  //             as: "subTopic",
  //           },
  //         },
  //         {
  //           $unwind: { path: "$subTopic", preserveNullAndEmptyArrays: true },
  //         }
  //       );

  //       if (userId && userId !== "undefined") {
  //         aggregationPipeline.push(
  //           {
  //             $lookup: {
  //               from: "usersubtopics",
  //               let: { subTopicId: { $toObjectId: "$subTopic._id" } },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $eq: ["$subTopicId", "$$subTopicId"] },
  //                         { $eq: ["$userId", new ObjectId(userId)] },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 { $limit: limit },
  //               ],
  //               as: "joinedData",
  //             },
  //           },
  //           {
  //             $addFields: {
  //               "subTopic.joined": { $gt: [{ $size: "$joinedData" }, 0] },
  //             },
  //           },
  //           { $unset: "joinedData" }
  //         );
  //       }

  //       aggregationPipeline.push({
  //         $group: {
  //           _id: "$_id",
  //           topicName: { $first: "$topicName" },
  //           subTopic: { $push: "$subTopic" },
  //         },
  //       });

  //       const topics = await TopicModel.aggregate(aggregationPipeline).sort({
  //         createdAt: 1,
  //         _id: -1,
  //       });

  //       const total = await TopicModel.countDocuments(
  //         topicName ? { topicName: { $regex: topicName, $options: "i" } } : {}
  //       );

  //       return {
  //         topics,
  //         total,
  //         page,
  //         limit,
  //         status: true,
  //       };
  //     } catch (error) {
  //       console.log(error);
  //       return { ok: false, error };
  //     }
  //   },
  //   {
  //     query: t.Object({
  //       page: t.Optional(t.Number()),
  //       limit: t.Optional(t.Number()),
  //       userId: t.Optional(t.String()),
  //       topicName: t.Optional(t.String()),
  //     }),
  //     detail: {
  //       summary: "Get All community",
  //       description: "Get All community with optional search by topicName",
  //     },
  //   }
  // )
  // .get(
  //   "/",
  //   async ({ query }) => {
  //     try {
  //       const { ObjectId } = require("mongoose").Types;

  //       const page = query.page || 1;
  //       const limit = query.limit || 10;
  //       const { userId, topicName } = query;

  //       const aggregationPipeline: any = [
  //         {
  //           $match: {
  //             isDeleted: false,
  //             active: true,
  //             ...(topicName && topicName.trim() !== "" && {
  //               topicName: { $regex: topicName, $options: "i" },
  //             }),
  //           },
  //         },
  //       ];


  //       if (topicName && topicName.trim() !== "") {
  //         aggregationPipeline.push({
  //           $match: {
  //             topicName: { $regex: topicName, $options: "i" },
  //             isDeleted: false,
  //             active: true,
  //           },
  //         });
  //       }

  //       aggregationPipeline.push(
  //         { $sort: { popularity: 1, topicName: 1, _id: -1 } },
  //         { $skip: (page - 1) * limit },
  //         { $limit: limit },
  //         {
  //           $lookup: {
  //             from: "subtopics",
  //             localField: "_id",
  //             foreignField: "topic",
  //             as: "subTopic",
  //           },
  //         },
  //         {
  //           $unwind: { path: "$subTopic", preserveNullAndEmptyArrays: true },
  //         },
  //         {
  //           $match: {
  //             "subTopic.isDeleted": false,
  //             "subTopic.active": true,
  //           },
  //         }
  //       );

  //       if (userId && userId !== "undefined") {
  //         aggregationPipeline.push(
  //           {
  //             $lookup: {
  //               from: "usersubtopics",
  //               let: { subTopicId: { $toObjectId: "$subTopic._id" } },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $eq: ["$subTopicId", "$$subTopicId"] },
  //                         { $eq: ["$userId", new ObjectId(userId)] },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 { $limit: limit },
  //               ],
  //               as: "joinedData",
  //             },
  //           },
  //           {
  //             $addFields: {
  //               "subTopic.joined": { $gt: [{ $size: "$joinedData" }, 0] },
  //             },
  //           },
  //           { $unset: "joinedData" }
  //         );
  //       }

  //       aggregationPipeline.push(
  //         {
  //           $lookup: {
  //             from: "groups",
  //             let: { subTopicId: { $toObjectId: "$subTopic._id" } },
  //             pipeline: [
  //               {
  //                 $match: {
  //                   $expr: { $eq: ["$subTopic", "$$subTopicId"] },
  //                 },
  //               },
  //               {
  //                 $group: {
  //                   _id: null,
  //                   groupCount: { $sum: 1 },
  //                   groupIds: { $push: "$_id" },
  //                 },
  //               },
  //             ],
  //             as: "groupStats",
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "events",
  //             let: {
  //               groupIds: {
  //                 $ifNull: [{ $arrayElemAt: ["$groupStats.groupIds", 0] }, []],
  //               },
  //             },
  //             pipeline: [
  //               {
  //                 $match: {
  //                   $expr: { $in: ["$group", "$$groupIds"] },
  //                 },
  //               },
  //               {
  //                 $group: {
  //                   _id: null,
  //                   totalEvents: { $sum: 1 },
  //                 },
  //               },
  //             ],
  //             as: "eventStats",
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "posts",
  //             let: { subTopicId: { $ifNull: ["$subTopic._id", null] } },
  //             pipeline: [
  //               {
  //                 $match: {
  //                   $expr: { $eq: ["$subTopic", "$$subTopicId"] },
  //                 },
  //               },
  //               {
  //                 $group: {
  //                   _id: null,
  //                   postCount: { $sum: 1 },
  //                 },
  //               },
  //             ],
  //             as: "postStats",
  //           },
  //         },
  //         {
  //           $addFields: {
  //             "subTopic.groupCount": {
  //               $ifNull: [{ $arrayElemAt: ["$groupStats.groupCount", 0] }, 0],
  //             },
  //             "subTopic.totalEvents": {
  //               $ifNull: [{ $arrayElemAt: ["$eventStats.totalEvents", 0] }, 0],
  //             },
  //             "subTopic.postCount": {
  //               $ifNull: [{ $arrayElemAt: ["$postStats.postCount", 0] }, 0],
  //             },
  //           },
  //         },
  //         {
  //           $unset: ["groupStats", "eventStats"],
  //         }
  //       );

  //       aggregationPipeline.push({
  //         $group: {
  //           _id: "$_id",
  //           topicName: { $first: "$topicName" },
  //           popularity: { $first: "$popularity" },
  //           subTopic: { $push: "$subTopic" },
  //         },
  //       });

  //       const topics = await TopicModel.aggregate(aggregationPipeline).sort({ popularity: 1 })

  //       const total = await TopicModel.countDocuments(
  //         topicName ? { topicName: { $regex: topicName, $options: "i" } } : {}
  //       );

  //       return {
  //         topics,
  //         total,
  //         page,
  //         limit,
  //         status: true,
  //       };
  //     } catch (error) {
  //       console.log(error);
  //       return { ok: false, error };
  //     }
  //   },
  //   {
  //     query: t.Object({
  //       page: t.Optional(t.Number()),
  //       limit: t.Optional(t.Number()),
  //       userId: t.Optional(t.String()),
  //       topicName: t.Optional(t.String()),
  //     }),
  //     detail: {
  //       summary: "Get All community",
  //       description: "Get All community with optional search by topicName",
  //     },
  //   }
  // )
  .get(
    "/",
    async ({ query }) => {
      try {
        const { ObjectId } = require("mongoose").Types;

        const page = query.page || 1;
        const limit = query.limit || 10;
        const { userId, topicName } = query;

        // Initial match stage
        const matchStage = {
          isDeleted: false,
          active: true,
          ...(topicName && topicName.trim() !== "" && {
            topicName: { $regex: topicName, $options: "i" },
          }),
        };

        // Start the pipeline with the initial match and sort
        const aggregationPipeline: any = [
          { $match: matchStage },
          { $sort: { popularity: 1, topicName: 1, _id: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit }
        ];

        // Add subtopic lookup
        aggregationPipeline.push(
          {
            $lookup: {
              from: "subtopics",
              localField: "_id",
              foreignField: "topic",
              as: "subTopic",
            },
          },
          {
            $unwind: { path: "$subTopic", preserveNullAndEmptyArrays: true },
          },
          {
            $match: {
              "subTopic.isDeleted": false,
              "subTopic.active": true,
            },
          },
          { $sort: { "subTopic.popularity": 1, "subTopic.subTopicName": 1, _id: -1 } }
        );

        // Add user joined info if userId is provided
        if (userId && userId !== "undefined") {
          aggregationPipeline.push(
            {
              $lookup: {
                from: "usersubtopics",
                let: { subTopicId: { $toObjectId: "$subTopic._id" } },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$subTopicId", "$$subTopicId"] },
                          { $eq: ["$userId", new ObjectId(userId)] },
                        ],
                      },
                    },
                  },
                  { $limit: 1 }, // We just need to know if any exist
                ],
                as: "joinedData",

              },
            },
            {
              $addFields: {
                "subTopic.joined": { $gt: [{ $size: "$joinedData" }, 0] },
              },
            },
            { $unset: "joinedData" }
          );
        }

        // Add statistics lookups
        aggregationPipeline.push(

          {
            $lookup: {
              from: "groups",
              let: {
                subTopicId: { $toObjectId: "$subTopic._id" },
                userId: userId ? new ObjectId(userId) : null,
                joined: "$subTopic.joined",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$subTopic", "$$subTopicId"] },
                        { $eq: ["$active", true] },
                      ],
                    },
                  },
                },
                // ✅ Filter groups whose groupAdmin follows the subtopic
                {
                  $lookup: {
                    from: "usersubtopics",
                    let: {
                      adminId: "$groupAdmin",
                      subTopicId: "$subTopic",
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              { $eq: ["$userId", "$$adminId"] },
                              { $eq: ["$subTopicId", "$$subTopicId"] },
                            ],
                          },
                        },
                      },
                    ],
                    as: "adminFollowCheck",
                  },
                },
                {
                  $match: {
                    $expr: {
                      $gt: [{ $size: "$adminFollowCheck" }, 0],
                    },
                  },
                },
                {
                  $match: {
                    $expr: {
                      $or: [
                        { $ne: ["$groupAdmin", "$$userId"] },
                        { $eq: ["$$joined", true] },
                        { $eq: ["$$userId", null] },
                      ],
                    },
                  },
                },
                {
                  $group: {
                    _id: null,
                    groupCount: { $sum: 1 },
                    groupIds: { $push: "$_id" },
                  },
                },
              ],
              as: "groupStats",
            },
          },
          {
            $lookup: {
              from: "events",
              let: {
                groupIds: {
                  $ifNull: [{ $arrayElemAt: ["$groupStats.groupIds", 0] }, []],
                },
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $in: ["$group", "$$groupIds"] },
                  },
                },
                {
                  $group: {
                    _id: null,
                    totalEvents: { $sum: 1 },
                  },
                },
              ],
              as: "eventStats",
            },
          },
          {
            $lookup: {
              from: "posts",
              let: { subTopicId: { $ifNull: ["$subTopic._id", null] } },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$subTopic", "$$subTopicId"] },
                  },
                },
                {
                  $lookup: {
                    from: "usersubtopics",
                    let: { postAuthorId: "$author", subTopicId: "$$subTopicId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              { $eq: ["$userId", "$$postAuthorId"] },
                              { $eq: ["$subTopicId", "$$subTopicId"] },
                            ],
                          },
                        },
                      },
                    ],
                    as: "authorFollowCheck",
                  },
                },
                {
                  $match: {
                    $expr: {
                      $gt: [{ $size: "$authorFollowCheck" }, 0],
                    },
                  },
                },
                {
                  $group: {
                    _id: null,
                    postCount: { $sum: 1 },
                  },
                },
              ],
              as: "postStats",
            },
          },
          {
            $addFields: {
              "subTopic.groupCount": {
                $ifNull: [{ $arrayElemAt: ["$groupStats.groupCount", 0] }, 0],
              },
              "subTopic.totalEvents": {
                $ifNull: [{ $arrayElemAt: ["$eventStats.totalEvents", 0] }, 0],
              },
              "subTopic.postCount": {
                $ifNull: [{ $arrayElemAt: ["$postStats.postCount", 0] }, 0],
              },
            },
          },
          {
            $unset: ["groupStats", "eventStats", "postStats"],
          }
        );

        // Group by topic
        aggregationPipeline.push({
          $group: {
            _id: "$_id",
            topicName: { $first: "$topicName" },
            popularity: { $first: "$popularity" }, // Preserve the popularity field for final sorting
            subTopic: { $push: "$subTopic" },
          },
        });

        // Final sort to maintain order after grouping
        aggregationPipeline.push({
          $sort: { popularity: 1, topicName: 1, _id: -1 }
        });

        const topics = await TopicModel.aggregate(aggregationPipeline);

        const total = await TopicModel.countDocuments(
          topicName ? { topicName: { $regex: topicName, $options: "i" } } : {}
        );

        return {
          topics,
          total,
          page,
          limit,
          status: true,
        };
      } catch (error: any) {
        console.log(error);
        return { ok: false, error: error.message };
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
        userId: t.Optional(t.String()),
        topicName: t.Optional(t.String()),
      }),
      detail: {
        summary: "Get All communities",
        description: "Get All communities with optional search by topicName",
      },
    }
  )
  .post(
    "/join",
    async ({ body }) => {
      let { subTopicId, userId } = body;

      try {
        if (!userId) {
          return { ok: false, error: "Login to join" };
        }

        const userSubTopic = await UserSubTopicModel.findOne({
          userId,
          subTopicId,
        });

        if (userSubTopic) {
          return { ok: false, error: "You're already joined" };
        }

        const newUserSubTopic = new UserSubTopicModel({
          userId,
          subTopicId,
        });

        await newUserSubTopic.save();

        return { ok: true, message: "Joined successfully" };
      } catch (error) {
        console.log(error);

        return { ok: false, error };
      }
    },
    {
      body: t.Object({
        userId: t.String(),
        subTopicId: t.String(),
      }),
      detail: {
        summary: "Join community",
        description: "Join community",
      },
    }
  )
  .get(
    "/info",
    async ({ query, set }) => {
      try {
        const subTopic = await SubTopicModel.findOne({ slug: query.slug });

        if (!subTopic) {
          set.status = 400;
          return { ok: false, error: "Subtopic not found" };
        }
        const { userId } = query;
        let isUserJoined = false;
        if (userId && userId !== "undefined") {
          console.log();
          const userSubTopic = await UserSubTopicModel.findOne({
            userId: new Types.ObjectId(userId),
            subTopicId: subTopic._id,
          }).lean();
          console.log(userSubTopic);
          if (userSubTopic) {
            isUserJoined = true;
          }
        }

        if (!subTopic) return { ok: false, error: "Invalid subtopic" };

        return {
          subTopic,
          status: true,
          isUserJoined,
        };
      } catch (error) {
        console.log(error);
        return { ok: false, error };
      }
    },
    {
      query: t.Object({
        slug: t.String(),
        userId: t.Optional(t.String()),
      }),
      detail: {
        summary: "Get subtopic info",
        description: "Get subtopic info",
      },
    }
  )

