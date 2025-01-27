import Elysia, { t } from "elysia";
import { PasetoUtil } from "../../lib/paseto";
import { UserModel } from "../../models/usermodel";

export const authController = new Elysia({
  prefix: "/auth",
  detail: {
    description: "User Auth controller",
    tags: ["User Auth"],
  },
}).post(
  "/login",
  async ({ body, set }) => {
    const { email, password } = body;
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        set.status = 404;
        return { message: "User not found" };
      }

      const isMatch = await Bun.password.verify(password, user.password);

      if (!isMatch) {
        set.status = 401;
        return { message: "Invalid password", ok: false };
      }

      const token = await PasetoUtil.encodePaseto({
        email: user.email.toString(),
        id: user._id.toString(),
        role: "user",
      });

      set.cookie = {
        you: {
          value: token,
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 1000 * 60 * 60 * 24,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      };

      return {
        message: "User logged in successfully",
        token,
        status: true,
        user: {
          email: user.email.toString(),
          name: user.name,
          id: user._id.toString(),
        },
      };
    } catch (error: any) {
      console.error("Error logging in:", error);

      set.status = 500;
      return {
        message: "An internal error occurred while logging in.",
        status: false,
      };
    }
  },
  {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String(),
    }),
    detail: {
      summary: "Login as a user",
    },
  }
);
