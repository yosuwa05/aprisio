import { CommentModel, EventModel, PostModel, UserModel } from "@/models";
import { GroupModel } from "@/models/group.model";
import { UserGroupsModel } from "@/models/usergroup.model";
import Elysia from "elysia";

export const personalAuthController = new Elysia({
  prefix: "/personal/auth",
  tags: ["User - Personal Auth Controller"],
}).get(
  "/profile",
  async ({ set, store }) => {
    try {
      const userId = (store as any)["id"];

      const userPromise = UserModel.findById(userId, "name email");

      const [
        user,
        totalPostsCreated,
        postsCommented,
        eventsOrganized,
        eventsParticipated,
        groupsCreated,
        groupParticipated,
      ] = await Promise.all([
        userPromise,
        PostModel.countDocuments({ author: userId }),
        CommentModel.distinct("post", { user: userId }),
        EventModel.countDocuments({ managedBy: userId }),
        EventModel.countDocuments({ attendees: { $in: [userId] } }),
        GroupModel.countDocuments({ groupAdmin: userId }),
        UserGroupsModel.countDocuments({ userId: userId, role: "member" }),
      ]);

      if (!user) {
        set.status = 400;
        return { message: "User not found" };
      }

      return {
        user,
        totalPostsCreated,
        postsCommented: postsCommented.length,
        eventsOrganized,
        eventsParticipated,
        groupsCreated,
        groupParticipated,
        status: true,
      };
    } catch (error) {
      console.log(error);
      set.status = 500;
      return {
        message: error,
      };
    }
  },
  {
    detail: {
      description: "Get personal profile",
      summary: "Get personal profile",
    },
  }
);
