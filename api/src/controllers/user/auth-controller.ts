import Elysia, { t } from "elysia";
import { PasetoUtil } from "../../lib/paseto";
import { UserModel } from "../../models/usermodel";

export const authController = new Elysia({
  prefix: "/auth",
  detail: {
    description: "User Auth controller",
    tags: ["User Auth"],
  },
})
  .post(
    "/login",
    async ({ body, set }) => {
      const { email, password } = body;
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return {
            message: "You don't have an account! Sign up first",
            ok: false,
          };
        }

        const isMatch = await Bun.password.verify(password, user.password);

        if (!isMatch) {
          return { message: "Kindly check your password", ok: false };
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
          ok: true,
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
  )
  .post(
    "/logout",
    async ({ set }) => {
      try {
        set.cookie = {
          you: {
            value: "",
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 0,
            expires: new Date(Date.now() - 1000 * 60 * 60 * 24),
          },
        };

        return {
          message: "User logged out successfully",
          ok: true,
        };
      } catch (error) {
        return {
          message: "An internal error occurred while logging out.",
          status: false,
        };
      }
    },
    {
      detail: {
        summary: "Logout a user",
      },
    }
  );
