import { GroupModel } from "@/models/group.model";
import Elysia, { t } from "elysia";

export const groupController = new Elysia({
  prefix: "/group",
  detail: {
    description: "Group controller",
    tags: ["User - Group"],
  },
}).post(
  "/create",
  async ({ body, set, store }) => {
    const { groupName, description, location, eventName, eventRules } = body;

    try {
      const userId = (store as any)["id"];

      if (!userId) {
        set.status = 401;
        return {
          message: "Unauthorized",
          ok: false,
        };
      }

      const existingGroup = await GroupModel.findOne({ name: groupName });

      if (existingGroup) {
        return {
          message: "Duplicate entry. Group already exists.",
          ok: false,
        };
      }

      const newGroup = new GroupModel({
        name: groupName,
        description,
        location,
        eventName,
        eventRules,
        user: userId,
      });

      await newGroup.save();

      set.status = 200;
      return { message: "Group created successfully", ok: true };
    } catch (error: any) {
      set.status = 500;
      return {
        message: "An internal error occurred while creating group.",
        ok: false,
      };
    }
  },
  {
    body: t.Object({
      groupName: t.String(),
      description: t.String(),
      location: t.String(),
      eventName: t.String(),
      eventRules: t.String(),
    }),
    summary: "Create group",
  }
);
