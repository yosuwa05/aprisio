import Elysia from "elysia";
import { adminrouter } from "./admin";
import { userrouter } from "./user";

export const baseRouter = new Elysia({
  prefix: "/api",
});

baseRouter.use(userrouter);
baseRouter.use(adminrouter);
