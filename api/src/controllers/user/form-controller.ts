import { sendEmail } from "@/lib/mail";
import { Elysia, t } from "elysia";
import { createHash, randomBytes } from "node:crypto";
import { UserModel } from "../../models/usermodel";

export function generateVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

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

        const verificationToken = generateVerificationToken();
        const hashedToken = hashToken(verificationToken);
        const tokenExpiration = new Date(Date.now() + 12 * 60 * 60 * 1000);

        const newUser = new UserModel({
          name,
          email,
          mobile,
          address,
          password,
          active: true,
          emailVerified: false,
          emailVerificationToken: hashedToken,
          emailVerificationTokenExpiry: tokenExpiration,
        });

        await newUser.save();

        let content = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f9f9f9">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h2 style="color: #333;">New User Joined!</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Message:</strong></p>
                  <p style="white-space: pre-wrap;">A new user has joined your platform!</p>
                  <p style="color: #ff9900;"><strong>Note:</strong> Email not verified.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <hr style="border: 1px solid #ddd; width: 80%;">
                  <p style="color: #777; font-size: 14px;">This email was sent from your platform to notify you of a new user registration.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

        // const verificationLink = `http://localhost:3001/form/verify-email?token=${verificationToken}`;
        const verificationLink = `https://aprisio.com/verify-email?token=${hashedToken}`;

        await sendEmail({
          subject: "New User Joined",
          to: "support@aprisio.com",
          html: content,
          from: "noreply@aprisio.com",
        });

        const verificationLink2 = `https://aprisio.com/verify-email?token=${hashedToken}`;



        set.status = 200;
        return {
          message:
            "Registration successful! ",
          ok: true,
        };
      } catch (error: any) {
        set.status = 500;
        return {
          ok: false,
          message: error,
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
  )
  .post(
    "/contact",
    async ({ body, set }) => {
      const { name, email, message } = body;
      try {
        let content = `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <h2 style="color: #333;">New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${message}</p>
      <hr style="border: 1px solid #ddd;">
      <p style="color: #777;">This email was sent from a contact form on your website.</p>
    </body>
  </html>
`;

        await sendEmail({
          subject: "New Contact Message",
          to: "support@aprisio.com",
          html: content,
          from: "hello@aprisio.com",
        });
        set.status = 200
        return {
          ok: true,
          message: "Message sent successfully",
        };
      } catch (error: any) {
        return {
          ok: false,
          message: "An internal error occurred while processing the form.",
        };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        message: t.String(),
      }),
    }
  )
  .post(
    "/verify-email",
    async ({ query, set }) => {
      const token = query.token as string;
      const hashedToken = token;

      const user: any = await UserModel.findOne({
        emailVerificationToken: hashedToken,
      });

      if (!user) {
        set.status = 400;
        return {
          message: "Invalid or expired token.",
          ok: false,
        };
      }
      let content2 = await Bun.file("html/welcomemail.html").text();

      if (user) {
        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationTokenExpiry = null;

        await sendEmail({
          subject: "Welcome to Aprisio",
          to: user.email,
          html: content2,
          from: "noreply@aprisio.com",
        });

        await user.save();
        set.status = 200;
        return {
          message: "Email verified successfully!",
          ok: true,
        };
      } else {
        set.status = 400;
        return {
          message: "Invalid or expired token.",
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        token: t.String(),
      }),
      detail: {
        description: "Verify email",
        summary: "Verify email",
      },
    }
  );
