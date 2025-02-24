import { EventModel, UserModel } from "@/models";
import Elysia, { t } from "elysia";

export const personalController = new Elysia({
  prefix: "/profile/personal",
  tags: ["User - Personal Controller"],
}).get(
  "/events",
  async ({ query }) => {
    try {
      let limit = Number(query.limit) || 10;
      let page = Number(query.page) || 1;

      const { userId } = query;

      const user = await UserModel.findOne({ name: userId });

      if (!user) {
        return {
          ok: false,
          error: "User not found",
        };
      }

      const events = await EventModel.find({ managedBy: user._id })
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-unnecessaryField")
        .lean();

      return {
        events,
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
    }),
    detail: {
      description: "Get Personal events",
      summary: "Get Personal events",
    },
  }
);
