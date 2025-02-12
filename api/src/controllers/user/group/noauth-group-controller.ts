import { GroupModel } from "@/models/group.model";
import { SubTopicModel } from "@/models/subtopicmodel";
import { UserGroupsModel } from "@/models/usergroup.model";
import Elysia, { t } from "elysia";

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
          searchQuery.$or = [
            { name: { $regex: search, $options: 'i' } },
            // { description: { $regex: search, $options: 'i' } }
          ];
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
        search: t.Optional(t.String())
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
      } catch (error) { }
    },
    {
      detail: {
        description: "Get group members",
        summary: "Get group members",
      },
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
  );
