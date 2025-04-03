import { EventModel } from "@/models";
import { GroupModel } from "@/models/group.model";
import { GroupPhotoModel } from "@/models/groupphotos.model";
import { SubTopicModel } from "@/models/subtopicmodel";
import { UserGroupsModel } from "@/models/usergroup.model";
import Elysia, { t } from "elysia";
import { Types } from "mongoose";

export const noAuthGroupController = new Elysia({
  prefix: "/noauth/group",
  detail: {
    summary: "Group controller",
    tags: ["Anonymous User - Group"],
  },
})
  .get(
    "/",
    async ({ query }) => {
      try {
        const { subTopic, userId, search } = query;

        const page = query.page || 1;
        const limit = query.limit || 10;

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

        let searchQuery: any = {
          subTopic: subTopicData._id,
        };

        if (search) {
          searchQuery.$or = [{ name: { $regex: search, $options: "i" } }];
        }

        const groups = await GroupModel.find(searchQuery)
          .populate("groupAdmin", "name")
          .sort({ createdAt: -1 })
          .skip((_page - 1) * _limit)
          .limit(_limit)
          .lean()
          .exec();

        const groupIds = groups.map((g) => g._id);

        let userJoinedGroups: any[] = [];
        if (userId) {
          userJoinedGroups = await UserGroupsModel.find({
            userId,
            group: { $in: groupIds },
          }).lean();
        }

        const joinedGroupSet = new Set(
          userJoinedGroups.map((ug) => String(ug.group))
        );

        const updatedGroups = groups.map((group) => {
          let canJoin = true;

          if (userId) {
            if (
              String(group.groupAdmin?._id) === userId ||
              joinedGroupSet.has(String(group._id))
            ) {
              canJoin = false;
            }
          }

          return { ...group, canJoin };
        });

        const total = await GroupModel.countDocuments(searchQuery);

        return {
          groups: updatedGroups,
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
        search: t.Optional(t.String()),
      }),
      detail: {
        description: "Get groups",
        summary: "Get groups",
      },
    }
  )
  .get(
    "/me",
    async ({ query }) => {
      try {
        const { userId } = query;

        const page = query.page || 1;
        const limit = query.limit || 10;

        let userJoinedGroups = await UserGroupsModel.find({
          userId,
        })
          .populate("group", "name slug memberCount")
          .populate("userId", "name")
          .lean();

        const updatedGroups = userJoinedGroups.map((group) => {
          return { ...group, canJoin: false };
        });

        const total = await UserGroupsModel.countDocuments({
          userId,
        });

        return {
          groups: updatedGroups,
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
        search: t.Optional(t.String()),
      }),
      detail: {
        description: "Get groups",
        summary: "Get groups",
      },
    }
  )
  .get(
    "/members",
    async ({ query }) => {
      try {
        const { groupid } = query;

        let group = await GroupModel.findById(groupid);

        if (!group) {
          return {
            message: "Group not found",
            ok: false,
          };
        }

        const newMembers = await UserGroupsModel.aggregate([
          { $match: { group: new Types.ObjectId(groupid) } },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $addFields: {
              name: "$user.name",
              image: "$user.image",
            },
          },
          {
            $lookup: {
              from: "usergroups",
              let: { userId: "$userId" },
              pipeline: [
                { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
                { $count: "joinedGroups" },
              ],
              as: "joinedGroups",
            },
          },
          {
            $addFields: {
              joinedGroups: { $arrayElemAt: ["$joinedGroups.joinedGroups", 0] },
            },
          },
          { $project: { user: 0 } },
        ]);

        return {
          members: newMembers,
          ok: true,
          message: "Members fetched successfully",
        };
      } catch (error) {
        return {
          error,
          ok: false,
        };
      }
    },
    {
      detail: {
        description: "Get group members",
        summary: "Get group members",
      },
      query: t.Object({
        groupid: t.String(),
      }),
    }
  )
  .get(
    "/get/:slug",
    async ({ params }) => {
      try {
        const { slug } = params;

        const group = await GroupModel.findOne({ slug });

        if (!group) {
          return {
            message: "Group not found",
            ok: false,
          };
        }

        return {
          group,
          ok: true,
        };
      } catch (error) {
        console.error("Error fetching groups:", error);
        return {
          message: error,
          ok: false,
        };
      }
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
      detail: {
        description: "Get Single Group Details.",
        summary: "Get Single Group Details.",
      },
    }
  )
  .get(
    "/events",
    async ({ query }) => {
      try {
        let limit = Number(query.limit) || 10;
        let page = Number(query.page) || 1;

        const { userId, groupid } = query;

        const group = await GroupModel.findOne({ _id: groupid });

        if (!group) {
          return {
            ok: false,
            message: "Group not found",
          };
        }
        const isMember = await UserGroupsModel.findOne({
          group: group._id,
          userId,
        });

        const events = await EventModel.find({ group: groupid, isApprovedByAdmin: true })
          .sort({ createdAt: -1, _id: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .select("-unnecessaryField")
          .lean();

        let tempEvents = events.map((event) => ({
          ...event,
          attending: userId
            ? event.attendees?.some(
              (attendee) => attendee.toString() === userId
            )
            : false,
        }));

        return {
          events: tempEvents,
          canJoin: !isMember,
          ok: true,
        };
      } catch (error) {
        console.error("Error fetching events: We Possibly fucked up.", error);

        return {
          ok: false,
          error,
        };
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
        userId: t.Optional(t.String()),
        groupid: t.String(),
      }),
      detail: {
        description: "Get group events",
        summary: "Get group events",
      },
    }
  )
  .get(
    "/photos",
    async ({ query }) => {
      try {
        const { groupid } = query;

        const page = query.page || 1;
        const limit = query.limit || 10;

        const photoEntries = await GroupPhotoModel.find({
          group: groupid,
        })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();

        return { photos: photoEntries, ok: true };
      } catch (error) {
        console.error(error);

        return {
          error,
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        groupid: t.String(),
        limit: t.Optional(t.Number()),
        page: t.Optional(t.Number()),
      }),
      detail: {
        summary: "Get group photos",
        description: "Get group photos",
      },
    }
  )
  .get(
    "/random-groups-events",
    async ({ set, query }) => {
      try {
        const { subtopicSlug } = query;

        const subTopic = await SubTopicModel.findOne({ slug: subtopicSlug });

        if (!subTopic) {
          return {
            message: "Invalid subtopic",
            ok: false,
          };
        }

        const groups = await GroupModel.aggregate([
          { $match: { subTopic: subTopic._id } },
          { $sample: { size: 3 } },
        ]);
        set.status = 200;
        return {
          groups,
          ok: true,
        };
      } catch (error: any) {
        console.error(error);
        return {
          message: "An error occurred",
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        subtopicSlug: t.String(),
      }),
      detail: {
        description: "Get random groups based on subtopic",
        summary: "Get random groups based on subtopic",
      },
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
          const userTopics = await UserGroupsModel.find(
            { userId: query.userId },
            "group"
          ).lean();

          const followedGroups = userTopics.map((topic) => topic.group);

          filter._id = { $in: followedGroups };
        }

        if (query.q) {
          filter.name = { $regex: query.q, $options: "i" };
        }

        const groups = await GroupModel.find(filter, "slug")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
          .exec();

        return {
          groups,
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
    "/getgroupsforshare",
    async ({ set, query }) => {
      try {
        const { userId, limit = 10, page = 1, search } = query;

        const matchStage: any = {};
        if (userId) {
          matchStage.userId = new Types.ObjectId(userId);
        }

        const pipeline: any[] = [
          { $match: matchStage },
          {
            $lookup: {
              from: "groups",
              localField: "group",
              foreignField: "_id",
              as: "group",
            },
          },
          { $unwind: "$group" },
          search
            ? { $match: { "group.name": { $regex: search, $options: "i" } } }
            : null,
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $project: {
              "group.name": 1,
              "group.slug": 1,
              userId: 1,
              "group._id": 1,
            },
          },
        ].filter(Boolean);

        const groups = await UserGroupsModel.aggregate(pipeline);

        set.status = 200;
        return {
          ok: true,
          groups,
        };
      } catch (error) {
        set.status = 500;
        return {
          ok: false,
          message: "Error while getting groups for share modal",
        };
      }
    },
    {
      detail: {
        description: "Get Groups for share modal",
      },
      query: t.Object({
        userId: t.String(),

        limit: t.Optional(
          t.Number({
            default: 10,
          })
        ),
        page: t.Optional(
          t.Number({
            default: 1,
          })
        ),
        search: t.Optional(t.String()),
      }),
    }
  );
