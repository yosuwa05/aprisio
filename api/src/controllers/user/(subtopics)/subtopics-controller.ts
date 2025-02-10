import { SubTopicModel } from "@/models/subtopicmodel";
import Elysia, { t } from "elysia";

export const subtopicsController = new Elysia({
  prefix: "/subtopics",
  tags: ["User - SubTopics"],
}).get(
  "/",
  async ({ query, set }) => {
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;

      const filter: any = {};

      if (query.q) {
        filter.subTopicName = { $regex: query.q, $options: "i" };
      }

      const subTopics = await SubTopicModel.find(filter, "subTopicName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();

      return {
        subTopics,
        status: true,
      };
    } catch (error) {
      console.log(error);
      set.status = 500;
      return { ok: false, error };
    }
  },
  {
    query: t.Object({
      page: t.Optional(t.Number()),
      limit: t.Optional(t.Number()),
      q: t.Optional(t.String()),
    }),
  }
);
