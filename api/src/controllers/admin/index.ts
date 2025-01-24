import Elysia from "elysia";
import { FileController } from "../file-controller";
import { adminController } from "./adminController";
import { adminAuthController } from "./auth";
import { userController } from "./userController";

export const adminrouter = new Elysia({
  prefix: "/admin",
})
  .use(adminAuthController)
  .use(userController)
  .use(adminController)
  .use(FileController);
