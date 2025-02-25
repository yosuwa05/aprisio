import { EventModel } from "@/models";
import { UserGroupsModel } from "@/models/usergroup.model";
import { UserSubTopicModel } from "@/models/usersubtopic.model";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";
import { Types } from "mongoose";

export const PersonalController = new Elysia({
  prefix: "/personal",
  detail: {
    summary: "Personal controller",
    tags: ["User - Personal"],
  },
})
  .get(
    "/joined-things",
    async ({ query, set, store }) => {
      try {
        const userId = (store as StoreType)["id"];

        const joinedGroups = await UserGroupsModel.aggregate([
          { $match: { userId: new Types.ObjectId(userId) } },
          {
            $sample: {
              size: 4,
            },
          },
          {
            $lookup: {
              from: "groups",
              localField: "group",
              foreignField: "_id",
              as: "group",
            },
          },
          {
            $unwind: "$group",
          },
          {
            $project: {
              groupName: "$group.name",
              groupSlug: "$group.slug",
            },
          },
        ]);

        const TopicsFollowed = await UserSubTopicModel.aggregate([
          { $match: { userId: new Types.ObjectId(userId) } },

          {
            $sample: {
              size: 4,
            },
          },
          {
            $lookup: {
              from: "subtopics",
              localField: "subTopicId",
              foreignField: "_id",
              as: "subtopic",
            },
          },
          {
            $unwind: "$subtopic",
          },
          {
            $project: {
              subtopicName: "$subtopic.subTopicName",
              subtopicSlug: "$subtopic.slug",
            },
          },
        ]);

        const joinedEvents = await EventModel.aggregate([
          { $match: { attendees: new Types.ObjectId(userId) } },
          {
            $sample: {
              size: 4,
            },
          },
          {
            $lookup: {
              from: "groups",
              localField: "group",
              foreignField: "_id",
              as: "group",
            },
          },
          {
            $unwind: "$group",
          },
          {
            $project: {
              eventName: "$eventName",
              groupSulg: "$group.slug",
            },
          },
        ]);

        set.status = 200;

        return {
          joinedGroups,
          TopicsFollowed,
          joinedEvents,
        };
      } catch (error: any) {
        console.log(error);
        set.status = 500;
        return {
          message: error,
        };
      }
    },
    {
      detail: {
        summary: "Get User joined things",
        description: "Get User joined things",
      },
    }
  )
  .get(
    "/groups",
    async ({ set, query, store }) => {
      try {
        const { limit, page } = query;
        const userId = (store as StoreType)["id"];

        const groups = await UserGroupsModel.find({
          userId,
        })
          .sort({ createdAt: -1 })
          .skip(page)
          .limit(limit || 10)
          .lean()
          .exec();

        set.status = 200;
        return {
          groups,
          ok: true,
        };
      } catch (error) {
        return {
          error,
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        limit: t.Number(),
        page: t.Number(),
      }),
    }
  );
