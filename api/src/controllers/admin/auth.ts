import { Elysia, t } from "elysia";
import jwtLib from "jsonwebtoken";
import { AdminAuthModel } from "../../models/adminmodel";

export const adminAuthController = new Elysia({
  prefix: "/auth",
})
  .post(
    "/create",
    async ({ body, set }) => {
      const { name, email, profileImage, password } = body;
      try {
        const newAdmin = new AdminAuthModel({
          email,
          profileImage,
          name,
          password,
        });

        await newAdmin.save();

        set.status = 201;
        return { message: "Admin created successfully", admin: newAdmin };
      } catch (error: any) {
        console.error("Error saving admin data:", error.message, error.stack);

        if (error.code === 11000) {
          set.status = 409;
          return { message: "Duplicate entry. Email already exists." };
        }

        set.status = 500;
        return {
          message:
            "An internal error occurred while processing the admin creation.",
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        profileImage: t.Optional(t.String()),
        password: t.String(),
        name: t.Optional(t.String()),
      }),
    }
  )

  .post(
    "/login",
    async ({ body, set }) => {
      const { email, password } = body;

      try {
        const admin = await AdminAuthModel.findOne({ email });
        if (!admin) {
          set.status = 401;
          return { message: "Invalid email or password." };
        }

        if (password !== admin.password) {
          set.status = 401;
          return { message: "Invalid email or password." };
        }

        const token = jwtLib.sign(
          { id: admin._id, email: admin.email },
          "jgj71nQD!#!sd1211aAS(@JCACalsxa1725",
          { expiresIn: "1d" }
        );

        set.status = 200; // 200 OK
        return { message: "Login successful", token, admin };
      } catch (error: any) {
        console.error("Error during login:", error);

        set.status = 500;
        return { message: "An internal error occurred during login." };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  )
  .post(
    "/logout",
    async ({ set }) => {
      set.status = 200;
      set.cookie = {
        admin: {
          value: "",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          expires: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
      };
      return { message: "Logout Successful" };
    },
    {
      detail: {
        summary: "Admin panel logout",
      },
    }
  );
