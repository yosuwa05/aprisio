import { sendEmail } from "@/lib/mail";
import Elysia, { t } from "elysia";
import { PasetoUtil } from "../../lib/paseto";
import { UserModel } from "../../models/usermodel";
import { generateVerificationToken, hashToken } from "./form-controller";

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

        if (!user.active) {
          return {
            message: "Your account is not active! Please contact admin",
            ok: false,
          };
        }

        const isMatch = await Bun.password.verify(password, user.password);

        if (!isMatch) {
          return { message: "Kindly check your password", ok: false };
        }

        const currentTime = new Date();


        if (!user.emailVerified) {
          const lastEmailSentTime = user.lastEmailSentTime ?? new Date(0);
          const timeSinceLastEmail = currentTime.getTime() - lastEmailSentTime.getTime();
          if (timeSinceLastEmail < 2 * 60 * 1000) {
            return {
              message: "Please wait before requesting a new verification email.",
              ok: false,
            };
          }

          const verificationToken = generateVerificationToken();
          const hashedToken = hashToken(verificationToken);
          const tokenExpiration = new Date(Date.now() + 12 * 60 * 60 * 1000);

          user.emailVerificationToken = hashedToken;
          user.emailVerificationTokenExpiry = tokenExpiration;
          user.lastEmailSentTime = currentTime;
          await user.save();

          // const verificationLink = `http://localhost:3001/verify-email?token=${hashedToken}`;
          const verificationLink = `https://aprisio.com/verify-email?token=${hashedToken}`;
          // const verificationLink = `https://development.aprisio.com/verify-email?token=${hashedToken}`;


          let content = `
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f9f9f9">
                  <tr>
                    <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <h2 style="color: #333;">Welcome to Aprisio!</h2>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 20px;">
                            <p>Hello ${user.name},</p>
                            <p>Thank you for joining Aprisio! We're excited to have you on board.</p>
                            <p>To get started, please verify your email address by clicking the link below:</p>
                            <p style="text-align: center; margin: 20px 0;">
                              <a href="${verificationLink}" style="background-color: #007BFF; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Your Email</a>
                            </p>
                            <p>If you didn't sign up for an Aprisio account, you can safely ignore this email.</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <hr style="border: 1px solid #ddd; width: 80%;">
                            <p style="color: #777; font-size: 14px;">If you have any questions, feel free to contact us at support@aprisio.com.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `;

          await sendEmail({
            subject: "Verify Your Email to Log In",
            to: email,
            html: content,
            from: "noreply@aprisio.com",
          });

          return {
            message:
              "Email verification required. A new verification email has been sent.",
            ok: false,
          };


        } else {
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
              image: user?.image,
              mobileNumber: user?.mobile
            },
          };
        }
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
    },
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
    },
  )
  .post(
    "/reset-password",
    async ({ body }) => {
      const { email } = body;

      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return {
            ok: false,
            message: "User not found",
          };
        }

        const verificationToken = generateVerificationToken();
        const hashedToken = hashToken(verificationToken);

        const resetLink = `https://development.aprisio.com/reset-password/${hashedToken}`;

        user.passwordResetToken = hashedToken;

        let content2 = `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f9f9f9">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <tr>
                      <td style="padding: 20px; text-align: center;">
                        <h2 style="color: #333;">Reset Your Password</h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px;">
                        <p>Hello ${user.name},</p>
                        <p>We received a request to reset your password. Click the button below to set a new password:</p>
                        <p style="text-align: center; margin: 20px 0;">
                          <a href="${resetLink}" style="background-color: #007BFF; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                        </p>
                        <p>If you didn't request a password reset, please ignore this email. Your account is safe.</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px; text-align: center;">
                        <hr style="border: 1px solid #ddd; width: 80%;">
                        <p style="color: #777; font-size: 14px;">If you need help, contact us at support@aprisio.com.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;

        await sendEmail({
          subject: "Reset Your Password",
          to: email,
          html: content2,
          from: "noreply@aprisio.com",
        });

        await user.save();

        return {
          ok: true,
          message: "Reset password mail sented! Please check your email!",
        };
      } catch (error) {
        return {
          ok: false,
        };
      }
    },
    {
      detail: {
        summary: "Reset password",
      },
      body: t.Object({
        email: t.String(),
      }),
    },
  )
  .post(
    "/confirm-reset-password",
    async ({ body, set }) => {
      const { token, password } = body;
      try {
        const user = await UserModel.findOne({ passwordResetToken: token });

        if (!user) {
          return {
            ok: false,
            message: "Invalid or expired token.",
          };
        }

        user.password = password;
        user.passwordResetToken = null;
        await user.save();

        return {
          ok: true,
          message: "Password reset successfully",
        };
      } catch (error) {
        return {
          ok: false,
        };
      }
    },
    {
      detail: {
        summary: "Confirm password reset",
      },
      body: t.Object({
        token: t.String(),
        password: t.String(),
      }),
    },
  );
