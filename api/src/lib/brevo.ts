import axios from "axios";

async function sendEmail() {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Mary from MyShop",
          email: "no-reply@myshop.com",
          id: 2,
        },
        to: [
          {
            email: "jimmy98@example.com",
            name: "Jimmy",
          },
        ],

        htmlContent:
          "<!DOCTYPE html> <html> <body> <h1>Confirm your email</h1> <p>Please confirm your email address by clicking on the link below</p> </body> </html>",
        textContent:
          "Please confirm your email address by clicking on the link https://text.domain.com",
        subject: "Login Email Confirmation",
        headers: {
          "sender.ip": "1.2.3.4",
          idempotencyKey: "abc-123",
        },
        templateId: 2,
        params: {
          FNAME: "Joe",
          LNAME: "Doe",
        },
        messageVersions: [
          {
            to: [{ email: "jimmy98@example.com", name: "Jimmy" }],
            params: { FNAME: "Joe", LNAME: "Doe" },
            bcc: [{ email: "helen9766@example.com", name: "Helen" }],
            cc: [{ email: "ann6533@example.com", name: "Ann" }],
            replyTo: { email: "ann6533@example.com", name: "Ann" },
            subject: "Login Email Confirmation",
            htmlContent:
              "<!DOCTYPE html> <html> <body> <h1>Confirm your email</h1> <p>Please confirm your email address by clicking on the link below</p> </body> </html>",
            textContent:
              "Please confirm your email address by clicking on the link https://text.domain.com",
          },
        ],
        tags: ["tag1"],
        scheduledAt: "2022-04-05T12:30:00+02:00",
        batchId: "5c6cfa04-eed9-42c2-8b5c-6d470d978e9d",
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": "YOUR_BREVO_API_KEY",
        },
      }
    );

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
// sendEmail();
