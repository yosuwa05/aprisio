import { validateToken } from "@/lib/utils";
import Elysia from "elysia";
import { postController } from "./(feed)/post-controller";
import { authController } from "./auth-controller";
import { formController } from "./form-controller";
import { verifyController } from "./verify-controller";

export const userrouter = new Elysia({
  prefix: "/user",
})
  .state("id", "")
  .state("email", "")
  .use(verifyController)
  .use(formController)
  .use(authController)
  .onBeforeHandle(async ({ set, headers, cookie, store }) => {
    let cookieString = cookie.you?.cookie ?? "";

    if (!cookieString) {
      set.status = 401;
      return {
        message: "Unauthorized",
      };
    }

    let pasetoToken = (cookieString.value as string) ?? "";

    if (!pasetoToken) {
      set.status = 401;
      return {
        message: "Unauthorized",
      };
    }

    if (!pasetoToken.startsWith("v4.local.")) {
      set.status = 401;
      return {
        message: "Unauthorized",
      };
    }

    try {
      const payload = await validateToken(pasetoToken ?? "");
      store["id"] = payload.id;
      store["email"] = payload.email;
    } catch (error) {
      set.status = 401;
      return { message: "Unauthorized" };
    }
  })
  .use(postController);
