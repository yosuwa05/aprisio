import { UserModel } from "@/models";
import Elysia from "elysia";

export const personalAuthController = new Elysia({
  prefix: "/personal/auth",
  tags: ["User - Personal Auth Controller"],
}).get(
  "/profile",
  async ({ set, store }) => {
    try {
      const userId = (store as any)["id"];

      const user = await UserModel.findById(userId, "name email");

      if (!user) {
        set.status = 400;
        return {
          message: "User not found",
        };
      }

      return {
        user,
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
