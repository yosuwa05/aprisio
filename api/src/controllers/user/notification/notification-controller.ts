import { NotificationModel } from "@/models/notificationmodel";
import { UserModel } from "@/models/usermodel";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";

export const notificationController = new Elysia({
  name: "notification",
  tags: ["user", "notification"],
  prefix: "/notification",
})

  .get(
    "/all",
    async ({ set, store, query }) => {
      try {
        const user = (store as StoreType)["id"];

        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;

        if (!user) {
          set.status = 401;
          return {
            message: "Unauthorized",
            ok: false,
          };
        }

        const userEx = await UserModel.findById(user);

        if (!userEx) {
          return {
            message: "User not found",
            ok: false,
          };
        }

        const notifications = await NotificationModel.find({
          user: userEx._id,
        }).populate("post", "slug")
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean()
          .exec();

        const totalLikes = await NotificationModel.countDocuments({
          user: userEx._id,
        });
        const hasNextPage = page * limit < totalLikes;

        set.status = 200;
        return {
          notifications,
          page,
          limit,
        };
      } catch (error) {
        console.error(error);
        set.status = 500;
        return { error: "Internal Server Error" };
      }
    },
    {
      query: t.Object({
        page: t.Number({}),
        limit: t.Optional(t.Number({})),
      }),
    },
  )
  .get(
    "/isnew-notification",
    async ({ set, store }) => {
      try {
        const user = (store as StoreType)["id"];

        if (!user) {
          set.status = 401;
          return {
            message: "Unauthorized",
            ok: false,
          };
        }

        const userEx = await UserModel.findById(user);

        if (!userEx) {
          return {
            message: "User not found",
            ok: false,
          };
        }

        const notifications = await NotificationModel.find({
          user: userEx._id,
          readAt: null,
        })

        let newNotification = false;

        if (notifications.length > 0) {
          newNotification = true
        }
        set.status = 200;
        return {
          newNotification
        };
      } catch (error) {
        console.error(error);
        set.status = 500;
        return { error: "Internal Server Error" };
      }
    },
    {
      detail: {
        summary: "new notification",
        description: "new notification"
      }
    },
  )
  .patch(
    "/markasread",
    async ({ set, store }) => {
      try {
        const user = (store as StoreType)["id"];

        if (!user) {
          set.status = 401;
          return {
            message: "Unauthorized",
            ok: false,
          };
        }

        const userEx = await UserModel.findById(user);

        if (!userEx) {
          return {
            message: "User not found",
            ok: false,
          };
        }

        await NotificationModel.updateMany({ user: userEx._id, readAt: null }, { $set: { readAt: new Date() } });

        set.status = 200;
        return {
          ok: true
        };
      } catch (error) {
        console.error(error);
        set.status = 500;
        return { error: "Internal Server Error" };
      }
    },
    {
      detail: {
        summary: "new notification",
        description: "new notification"
      }
    },
  )