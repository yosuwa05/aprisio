import { UserGroupsModel } from "@/models/usergroup.model";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";

export const PersonalController = new Elysia({
  prefix: "/personal",
  detail: {
    summary: "Personal controller",
    tags: ["User - Personal"],
  },
}).get(
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
