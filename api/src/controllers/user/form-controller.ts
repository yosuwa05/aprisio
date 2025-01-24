import { Elysia, t } from "elysia";
import { UserModel } from "../../models/usermodel";

export const formController = new Elysia({
  prefix: "/form",
  detail: {
    description: "Form controller",
    tags: ["User Form"],
  },
}).post(
  "/submit",
  async ({ body, set }) => {
    const { name, email, mobile, address } = body;
    try {
      const newUser = new UserModel({
        name,
        email,
        mobile,
        address,
      });

      await newUser.save();
      set.status = 200;
      return { message: "Form submitted successfully" };
    } catch (error: any) {
      console.error("Error saving form data:", error);

      if (error.code === 11000) {
        set.status = 409;
        return { message: "Duplicate entry. Email or mobile already exists." };
      }

      set.status = 500;
      return {
        message: "An internal error occurred while processing the form.",
      };
    }
  },
  {
    body: t.Object({
      email: t.String({ format: "email" }),
      mobile: t.String(),
      address: t.String(),
      name: t.String(),
    }),
    detail: {
      description: "Submit form data",
      summary: "Submit form data",
    },
  }
);
