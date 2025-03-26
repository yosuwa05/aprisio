import nodemailer from "nodemailer";

interface EmailAttachment {
  filename: string;
  path?: string;
  content?: Buffer;
  contentType?: string;
}

interface EmailOptions {
  from: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
}

export async function sendEmail(option: EmailOptions) {
  try {
    let emailId = process.env.EMAIL_ID;
    let appPassword = process.env.APP_PASSWORD;

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: emailId,
        pass: appPassword,
      },
    });

    const info = await transporter.sendMail({
      from: '"Aprisio" <hello@aprisio.com>',
      to: option.to,
      cc: option.cc,
      bcc: option.bcc,
      subject: option.subject,
      text: option.text,
      html: option.html,
      attachments: option.attachments,
    });


    return {
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
      originalError: error,
    };
  }
}
