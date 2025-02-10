import { GroupModel } from "@/models/group.model";
import { SubTopicModel } from "@/models/subtopicmodel";
import Elysia, { t } from "elysia";

export const noAuthGroupController = new Elysia({
  prefix: "/noauth/group",
  detail: {
    summary: "Group controller",
    tags: ["Anonymous User - Group"],
  },
}).get(
  "/",
  async ({ query }) => {
    const { page, limit, subTopic, userId } = query;

    try {
      let subTopicData = await SubTopicModel.findOne({ slug: subTopic });

      let _limit = limit ?? 10;
      let _page = page ?? 1;

      if (!subTopicData) {
        return {
          data: [],
          message: "Invalid subtopic",
          ok: false,
        };
      }

      const groups = await GroupModel.find({
        subTopic: subTopicData._id,
      })
        .populate("groupAdmin", "name")
        .sort({ createdAt: -1 })
        .skip((_page - 1) * _limit)
        .limit(_limit)
        .lean()
        .exec();

      const total = await GroupModel.countDocuments({
        subTopic: subTopicData._id,
      });

      return {
        groups,
        ok: true,
        page,
        limit,
        total,
      };
    } catch (error) {
      console.error("Error fetching groups:", error);
      return {
        message: "An error occurred while fetching groups.",
        ok: false,
      };
    }
  },
  {
    query: t.Object({
      page: t.Number(),
      limit: t.Number(),
      subTopic: t.Optional(t.String()),
      userId: t.Optional(t.String()),
    }),
    detail: {
      description: "Get groups",
      summary: "Get groups",
    },
  }
);
