import { validateToken } from "@/lib/utils";
import Elysia from "elysia";
import { validatorController } from "./(auth)/validate-controller";
import { commentsController } from "./(feed)/comment-auth-controller";
import { commentsNoAuthController } from "./(feed)/comment-controller";
import { draftsController } from "./(feed)/drafts-controller";
import { authenticatedPostController } from "./(feed)/post-auth-controller";
import { postController } from "./(feed)/post-controller";
import { subtopicsController } from "./(subtopics)/subtopics-controller";
import { TopicsController } from "./(topics)/topics-controller";
import { authController } from "./auth-controller";
import { communityController } from "./community/community-controller";
import { formController } from "./form-controller";
import { groupController } from "./group/group-controller";
import { verifyController } from "./verify-controller";

export const userrouter = new Elysia({
  prefix: "/user",
})
  .state("id", "")
  .state("email", "")
  .use(verifyController)
  .use(formController)
  .use(authController)
  .use(postController)
  .use(commentsNoAuthController)
  .use(communityController)
  .use(subtopicsController)
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
  .use(validatorController)
  .use(authenticatedPostController)
  .use(draftsController)
  .use(commentsController)
  .use(TopicsController)
  .use(communityController)
  .use(groupController);
