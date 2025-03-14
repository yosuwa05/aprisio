import { AdminEventModel } from "@/models/admin-events.model";
import { TicketModel } from "@/models/ticket-tracking";
import axios from "axios";
import { Elysia, t } from "elysia";
import path from "node:path";
import puppeteer from "puppeteer";
import { deleteFile, saveFile } from "../../lib/file";
import { AdminAuthModel } from "../../models/adminmodel";
import { unlink } from "fs/promises";
const getBase64Image = async (imageUrl: string) => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const base64 = Buffer.from(response.data, "binary").toString("base64");
    const mimeType = response.headers["content-type"];

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error("Error fetching image:", error);
    return "";
  }
};

export const adminController = new Elysia({
  prefix: "/admin",
})
  .get("/", async ({ query, set }) => {
    try {
      const { id } = query;

      const ticket = await TicketModel.findById(id);

      if (!ticket) {
        return { message: "Ticket not found" };
      }

      let browser;

      const event: any = await AdminEventModel.findById(ticket.eventId);

      if (!event) {
        set.status = 40;
        return {
          message: "Event not Found",
          ok: false,
        };
      }

      let content = await Bun.file("html/template.html").text();

      const imageUrl =
        "https://aprisio.com/api/user/file?key=" + event.eventImage;

      const base64Image = await getBase64Image(imageUrl);

      content = content
        .replace("{{ticket_ID}}", ticket.tickets.ticketId)
        .replace("{{EventName}}", event.eventName)
        .replace("{{Date}}", event.createdAt)
        .replace("{{Location}}", event.location)
        .replace("{{UserName}}", "Sudhan")
        .replace("{{BookingDate}}", "21 Oct 2025 ")
        .replace("{{totalTickets}}", "5")
        .replace("{{Amount}}", "500")
        .replace("{{GST}}", "0")
        .replace("{{imageUrl}}", base64Image)
        .replace("{{TotalAmount}}", "2500");

      browser = await puppeteer.launch({
        headless: true,
        browser: "chrome",
        // executablePath:
        //   ".cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setViewport({
        width: 1920,
        height: 1000,
        deviceScaleFactor: 1,
      });
      await page.setContent(content);

      const pdfPath = path.join(process.cwd(), "ticket.pdf");

      await page.pdf({
        path: pdfPath,
        format: "A4",
        scale: 1,
        waitForFonts: true,
      });

      const file = Bun.file(pdfPath);
      const buffer = await file.arrayBuffer();
      const blob = new Blob([buffer], { type: "application/pdf" });

      set.headers["Content-Type"] = "application/pdf";
      set.headers["Content-Disposition"] = `inline; filename=invoice.pdf`;

      if (browser) {
        browser.close();
      }
      await unlink(pdfPath)
      return blob;
    } catch (error) {
      console.log(error);
      return {
        error,
        status: "error",
      };
    }
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
    }
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
            "admins"
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
          })
        ),
        password: t.Optional(t.String()),
        profileImage: t.Optional(t.Any()),
      }),
      detail: {
        summary: "Edit admin information",
      },
    }
  );
