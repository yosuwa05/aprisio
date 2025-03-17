import { Elysia, t } from "elysia";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const SECRET_KEY = "wdscfiluhnboegiryufjhvcoirf2974369828410lmdsf#$#%%^@$@";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stainsrubus@gmail.com",
    pass: "izgc asmp rrpb fkob",
  },
});

export const verifyController = new Elysia({
  prefix: "/verify",
})
  .post(
    "/email",
    async ({ body }) => {
      const { email } = body;

      if (!email) {
        return { success: false, message: "Email is required" };
      }

      try {
        // Generate JWT token
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

        // Generate verification link
        const verificationLink = `https://aprisio-prodcution.vercel.app/join-community?token=${token}&email=${encodeURIComponent(
          email
        )}`;

        // Send email
        await transporter.sendMail({
          from: "hello@aprisio.com", // Sender email
          to: email,
          subject: "Email Verification",
          text: `Click the link to verify your email: ${verificationLink}`,
          html: `
                    <p>Please click the button below to verify your email address:</p>
                    <a href="${verificationLink}" style="
                        display: inline-block;
                        padding: 10px 20px;
                        font-size: 16px;
                        color: #ffffff;
                        background-color: #007bff;
                        text-decoration: none;
                        border-radius: 5px;
                        text-align: center;
                    " target="_blank">Verify Email</a>
                    <p>If you did not request this, please ignore this email.</p>
                `,
        });

        return { success: true, message: "Verification email sent" };
      } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send verification email" };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
      }),
    }
  )
  .post(
    "/email/confirm",
    async ({ body }) => {
      const { token, email } = body;

      if (!token || !email) {
        return {
          success: false,
          message: "Token and email are required",
        };
      }

      try {
        // Verify the JWT token
        const decoded = jwt.verify(token, SECRET_KEY) as {
          email: string;
          exp?: number;
        };

        // Check if the token is expired
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
          return {
            success: false,
            message: "Verification link has expired",
          };
        }

        // Check if the email in the token matches the provided email
        if (decoded.email !== email) {
          return {
            success: false,
            message: "Invalid verification token",
          };
        }

        // If everything is valid, return success
        return {
          success: true,
          message: "Email verified successfully",
        };
      } catch (error) {
        console.error("Token verification error:", error);
        return {
          success: false,
          message: "Invalid verification token",
        };
      }
    },
    {
      body: t.Object({
        token: t.String(),
        email: t.String({ format: "email" }),
      }),
    }
  );
