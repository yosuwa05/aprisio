import { Elysia } from "elysia";
import { adminController } from "./admin/adminController";
import { adminAuthController } from "./admin/auth";
import { userController } from "./admin/userController";
import { FileController } from "./file-controller";
import { formController } from "./user/form-controller";
import { verifyController } from "./user/verify-controller";
export const AdminRouter = new Elysia({
  prefix: "/api/admin",
})
  .use(adminAuthController)
  .use(userController)
  .use(adminController)
  .use(FileController);

export const UserRouter = new Elysia({
  prefix: "/api/user",
})
  .use(verifyController)
  .use(formController);
