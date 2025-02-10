import { TopicModel } from "@/models/topicsmodel";
import { UserSubTopicModel } from "@/models/usersubtopic.model";
import Elysia, { t } from "elysia";

export const communityController = new Elysia({
  prefix: "/community",
  tags: ["User - Community"],
})
  .get(
    "/",
    async ({ query }) => {
      try {
        const { ObjectId } = require("mongoose").Types;

        const page = query.page || 1;
        const limit = query.limit || 10;
        const { userId } = query;

        const aggregationPipeline: any = [
          { $sort: { createdAt: 1 } },
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
          },
        ];

        if (userId && userId != "undefined") {
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
                  { $limit: 1 },
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

        aggregationPipeline.push({
          $group: {
            _id: "$_id",
            topicName: { $first: "$topicName" },
            subTopic: { $push: "$subTopic" },
          },
        });

        const topics = await TopicModel.aggregate(aggregationPipeline);
        const total = await TopicModel.countDocuments();

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
      }),
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
    }
  );
