import { SubTopicModel } from "@/models/subtopicmodel";
import { TopicModel } from "@/models/topicsmodel";
import Elysia, { t } from "elysia";

export const TopicsController = new Elysia({
  prefix: "/topics",
  tags: ["User - Topics"],
})
  .get(
    "/",
    async ({ query }) => {
      try {
        const page = query.page || 1;
        const limit = query.limit || 10;

        const topics = await TopicModel.find({}, "topicName")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
          .exec();

        const total = await TopicModel.countDocuments({});

        return {
          topics,
          total,
          ok: true,
        };
      } catch (error) {}
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
      }),
    }
  )
  .get(
    "/getsubtopics",
    async ({ query }) => {
      try {
        const page = query.page || 1;
        const limit = query.limit || 10;

        if (!query.topic || query.topic == "undefined") return { ok: true };

        const subTopic = await SubTopicModel.find(
          query.topic ? { topic: query.topic } : {},
          "subTopicName"
        )
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
          .exec();

        const total = await SubTopicModel.countDocuments({});

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
