import { SubTopicModel } from "@/models/subtopicmodel";
import { UserSubTopicModel } from "@/models/usersubtopic.model";
import Elysia, { t } from "elysia";

export const subtopicsController = new Elysia({
  prefix: "/subtopics",
  tags: ["User - SubTopics"],
})
  .get(
    "/",
    async ({ query, set }) => {
      try {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const filter: any = {};

        if (query.userId && query.userId != "undefined") {
          const userTopics = await UserSubTopicModel.find(
            { userId: query.userId },
            "subTopic"
          ).lean();

          const followedTopicIds = userTopics.map((topic) => topic.subTopicId);

          filter._id = { $in: followedTopicIds };
        }

        if (query.q) {
          filter.subTopicName = { $regex: query.q, $options: "i" };
        }

        const subTopics = await SubTopicModel.find(filter, "slug")
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
        userId: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/dropdown",
    async ({ query, set }) => {
      try {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const filter: any = {};

        if (query.userId && query.userId != "undefined") {
          const userTopics = await UserSubTopicModel.find(
            { userId: query.userId },
            "subTopic"
          ).lean();

          const followedTopicIds = userTopics.map((topic) => topic.subTopicId);

          filter._id = { $in: followedTopicIds };
        }

        if (query.q) {
          filter.subTopicName = { $regex: query.q, $options: "i" };
        }

        const subTopics = await SubTopicModel.find(filter, "slug")
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
        userId: t.Optional(t.String()),
      }),
    }
  );
