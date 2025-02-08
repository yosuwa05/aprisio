import { TopicModel } from "@/models/topicsmodel";
import Elysia, { t } from "elysia";

export const communityController = new Elysia({
  prefix: "/community",
  tags: ["User - Community"],
}).get(
  "/",
  async ({ query }) => {
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;

      const subTopic = await TopicModel.aggregate([
        {
          $lookup: {
            from: "subtopics",
            localField: "_id",
            foreignField: "topic",
            as: "subTopic",
          },
        },
        {
          $project: {
            topicName: 1,
            subTopic: 1,
          },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ]);

      const total = await TopicModel.countDocuments({});

      return {
        topics: subTopic,
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
    }),
  }
);
