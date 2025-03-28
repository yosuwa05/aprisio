import Elysia from "elysia";
import { adminController } from "./adminController";
import { adminAuthController } from "./auth";
import { eventsController } from "./events-controller";
import { subtopicController } from "./subtopic-controllers";
import { topicsController } from "./topics-controller";
import { userController } from "./userController";
import { UserEventController } from "./user-event-controller";

export const adminrouter = new Elysia({
  prefix: "/admin",
})
  .use(adminAuthController)
  .use(userController)
  .use(adminController)
  .use(topicsController)
  .use(subtopicController)
  .use(eventsController)
  .use(UserEventController)
