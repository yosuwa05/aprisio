import { Elysia, t } from "elysia";
import { deleteFile, saveFile } from "../../lib/file";
import { AdminAuthModel } from "../../models/adminmodel";

export const adminController = new Elysia({
  prefix: "/admin",
})
  .get(
    "/:id",
    async ({ params }) => {
      try {
        const { id } = params;

        const user = await AdminAuthModel.findById(id);

        if (!user) {
          return { message: "Admin not found" };
        }

        return {
          user,
          status: "success",
        };
      } catch (error) {
        console.log(error);
        return {
          error,
          status: "error",
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Get admin by id",
      },
    },
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      try {
        const { id } = params;
        const { name, email, password, profileImage } = body;

        const admin = await AdminAuthModel.findById(id);

        if (!admin) {
          return { message: "Admin not found" };
        }

        if (name) admin.name = name;
        if (email) admin.email = email;
        if (password) admin.password = password;

        let filename = admin.profileImage;

        if (
          profileImage &&
          profileImage !== "undefined" &&
          profileImage !== "null"
        ) {
          let { ok, filename: newFilename } = await saveFile(
            profileImage,
            "admins",
          );

          if (!ok) {
            return {
              message: "Something went wrong while uploading profile image",
              ok: false,
            };
          }

          filename = newFilename as string;

          deleteFile(admin.profileImage);
        }

        admin.profileImage = filename || admin.profileImage;

        await admin.save();

        return {
          message: "Admin updated successfully",
          status: "success",
          data: admin,
        };
      } catch (error: any) {
        console.log(error);
        return {
          error,
          status: "error",
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String()),
        email: t.Optional(
          t.String({
            validate: (value: string) =>
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
              "Invalid email format",
          }),
        ),
        password: t.Optional(t.String()),
        profileImage: t.Optional(t.Any()),
      }),
      detail: {
        summary: "Edit admin information",
      },
    },
  );
