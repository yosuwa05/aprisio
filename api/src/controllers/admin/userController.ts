import { Elysia, t } from "elysia";
import { UserModel } from "../../models/usermodel";

export const userController = new Elysia({
  prefix: "/user",
})

  .get(
    "/all",
    async ({ query }) => {
      try {
        const { page, limit, q } = query;
        let _limit = limit || 10;
        let _page = page || 1;

        const searchQuery: any = {};

        if (q) {
          searchQuery.name = { $regex: q, $options: "i" };
        }

        const users = await UserModel.find(searchQuery)
          .skip((_page - 1) * _limit)
          .limit(_limit)
          .sort({ createdAt: -1 })
          .select("email address name mobile active createdAt")
          .exec();

        const totalUsers = await UserModel.countDocuments({});

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
          })
        ),
      }),
      detail: {
        summary: "Get all users for admin panel",
      },
    }
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
    }
  )
  .post(
    "/banuser/:id",
    async ({ params }) => {
      try {
        const { id } = params;

        const user = await UserModel.findById(id);
        if (!user) {
          return { message: "User not found" };
        }

        user.active = !user.active;
        await user.save();

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
        summary: "Deactivate a user by id",
      },
    }
  );
