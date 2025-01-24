import Elysia from "elysia";
import { authController } from "./auth-controller";
import { formController } from "./form-controller";
import { verifyController } from "./verify-controller";

export const userrouter = new Elysia({
  prefix: "/user",
})
  .use(verifyController)
  .use(formController)
  .use(authController);
