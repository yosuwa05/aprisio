import { UserModel } from "@/models";
import { UserGroupsModel } from "@/models/usergroup.model";
import { UserSubTopicModel } from "@/models/usersubtopic.model";
import { Elysia, t } from "elysia";

export const userController = new Elysia({
  prefix: "/user",
  detail: {
    tags: ["Client - Users"],
  },
})
  .get(
    "/getall",
    async ({ query }) => {
      try {
        const { page, limit, q } = query;
        let _limit = limit || 10;
        let _page = page || 1;

        const searchQuery: any = {
          active: true,
        };

        if (q) {
          searchQuery.name = { $regex: q, $options: "i" };
        }

        const users = await UserModel.find(searchQuery)
          .skip((_page - 1) * _limit)
          .limit(_limit)
          .sort({ createdAt: -1 })
          .select("email address name mobile active createdAt")
          .exec();

        const totalUsers = await UserModel.countDocuments({
          active: true,
        });

        return {
          users,
          status: "success",
          total: totalUsers,
        };
      } catch (error) {
        console.log(error);
        return {
          error,
          status: "error",
        };
      }
    },
    {
      query: t.Object({
        page: t.Number({
          default: 1,
        }),
        limit: t.Number({
          default: 10,
        }),
        q: t.Optional(
          t.String({
            default: "",
          }),
        ),
      }),
      detail: {
        summary: "Get all users for Client site",
        description: "Get all users for Client site",
      },
    },
  )
  .get(
    "/:id",
    async ({ params }) => {
      try {
        const { id } = params;

        const user = await UserModel.findById(id, "-password");

        if (!user) {
          return { message: "User not found" };
        }

        return {
          user,
          status: "success",
        };
      } catch (error) {
        console.log(error);
        return {
          error,
          status: "error",
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Get a user by id",
      },
    },
  )
  .get(
    "/getprofilebyname",
    async ({ query }) => {
      try {
        const { slug } = query;

        const user = await UserModel.findOne({ name: slug });

        if (!user) {
          return { message: "User not found" };
        }

        const [groupsCount, subtopicsFollowed] = await Promise.all([
          UserGroupsModel.countDocuments({ userId: user._id }),
          UserSubTopicModel.countDocuments({ userId: user._id }),
        ]);

        const followedByUser = await UserSubTopicModel.find({
          userId: user._id,
        })
          .populate("subTopicId", "subTopicName slug")
          .limit(2)
          .sort({ createdAt: -1 })
          .lean();

        return {
          user,
          groupsCount,
          subtopicsFollowed,
          followedByUser,
          status: "success",
        };
      } catch (error) {
        console.log(error);
        return {
          error,
          status: "error",
        };
      }
    },
    {
      query: t.Object({
        slug: t.String(),
      }),
      detail: {
        summary: "Get a user by slug",
      },
    },
  );
