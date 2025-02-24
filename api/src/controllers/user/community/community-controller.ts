import { SubTopicModel } from "@/models/subtopicmodel";
import { TopicModel } from "@/models/topicsmodel";
import { UserSubTopicModel } from "@/models/usersubtopic.model";
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
  .get(
    "/",
    async ({ query }) => {
      try {
        const { ObjectId } = require("mongoose").Types;

        const page = query.page || 1;
        const limit = query.limit || 10;
        const { userId, topicName } = query;

        const aggregationPipeline: any = [];

        if (topicName && topicName.trim() !== "") {
          aggregationPipeline.push({
            $match: {
              topicName: { $regex: topicName, $options: "i" },
            },
          });
        }

        aggregationPipeline.push(
          { $sort: { createdAt: -1, _id: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
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
          }
        );

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
                  { $limit: limit },
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

        aggregationPipeline.push(
          {
            $lookup: {
              from: "groups",
              let: { subTopicId: { $toObjectId: "$subTopic._id" } },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$subTopic", "$$subTopicId"] },
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
            $addFields: {
              "subTopic.groupCount": {
                $ifNull: [{ $arrayElemAt: ["$groupStats.groupCount", 0] }, 0],
              },
              "subTopic.totalEvents": {
                $ifNull: [{ $arrayElemAt: ["$eventStats.totalEvents", 0] }, 0],
              },
            },
          },
          {
            $unset: ["groupStats", "eventStats"],
          }
        );

        aggregationPipeline.push({
          $group: {
            _id: "$_id",
            topicName: { $first: "$topicName" },
            subTopic: { $push: "$subTopic" },
          },
        });

        const topics = await TopicModel.aggregate(aggregationPipeline).sort({
          createdAt: 1,
          _id: -1,
        });

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
      } catch (error) {
        console.log(error);
        return { ok: false, error };
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
        summary: "Get All community",
        description: "Get All community with optional search by topicName",
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
  );
