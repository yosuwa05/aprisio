import { Elysia, t } from "elysia";
import { UserModel } from "../../models/usermodel";

export const formController = new Elysia({
  prefix: "/form",
  detail: {
    description: "Form controller",
    tags: ["User Form"],
  },
})
.post(
  "/submit",
  async ({ body, set }) => {
    const { name, email, mobile, address, password } = body;
    try {
      const existing = await UserModel.findOne({
        $or: [{ email }, { mobile }],
      });

      if (existing) {
        return { message: "Email or mobile already exists", ok: false };
      }

      const newUser = new UserModel({
        name,
        email,
        mobile,
        address,
        password,
        active: true,
      });

      await newUser.save();
      set.status = 200;
      return { message: "Registration successful", ok: true };
    } catch (error: any) {
      set.status = 500;
      return {
        ok: false,
        message: "An internal error occurred while processing the form.",
      };
    }
  },
  {
    body: t.Object({
      email: t.String({ format: "email" }),
      mobile: t.String(),
      address: t.Optional(
        t.String({
          default: "",
        })
      ),
      name: t.String(),
      password: t.String(),
    }),
    detail: {
      description: "Submit form data",
      summary: "Submit form data",
    },
  }
);
