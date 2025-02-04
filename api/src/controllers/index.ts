import Elysia from "elysia";
import { adminrouter } from "./admin";
import { fileController } from "./file-controller";
import { userrouter } from "./user";

export const baseRouter = new Elysia({
  prefix: "/api",
});

baseRouter.use(fileController);
baseRouter.use(userrouter);
baseRouter.use(adminrouter);
