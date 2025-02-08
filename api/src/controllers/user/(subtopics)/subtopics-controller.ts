import { SubTopicModel } from "@/models/subtopicmodel";
import Elysia, { t } from "elysia";

export const subtopicsController = new Elysia({
  prefix: "/subtopics",
  tags: ["User - SubTopics"],
}).get(
  "/",
  async ({ query }) => {
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;

      const subTopic = await SubTopicModel.find(
        { topic: query.topic },
        "subTopicName"
      )
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();

      const total = await SubTopicModel.countDocuments({
        topic: query.topic,
      });

      return {
        subTopics: subTopic,
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
      topic: t.Optional(t.String()),
    }),
  }
);
