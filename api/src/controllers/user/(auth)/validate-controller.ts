import { UserModel } from "@/models";
import { StoreType } from "@/types";
import Elysia from "elysia";

export const validatorController = new Elysia({
  prefix: "/validate",
  detail: {
    description: "User Validator",
    tags: ["Validate Controller"],
  },
}).get("/", async ({ set, store }) => {
  try {
    const userId = (store as StoreType)["id"];

    const user = await UserModel.findById(userId);

    if (!user) return { message: "Unauthorized" };

    return { ok: true, message: "Auth Successful" };
  } catch (error) {
    set.status = 401;
    return { message: "Unauthorized" };
  }
});
