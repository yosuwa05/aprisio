import { EventModel } from "@/models";
import { AdminEventModel } from "@/models/admin-events.model";
import Elysia, { t } from "elysia";
import puppeteer from "puppeteer";
import { unlink } from "fs/promises";
import path from "path";
export const EventsNoAuthController = new Elysia({
  prefix: "/events/noauth",
  detail: {
    tags: ["User - Events - NoAuth"],
  },
})
  .get(
    "/view-event",
    async ({ set, query }) => {
      try {
        const userId = query.userId;

        const { eventId } = query;
        const event = await EventModel.findOne({ _id: eventId })
          .populate("group", "name")
          .populate("managedBy", "name")
          .lean();

        if (!event) {
          set.status = 400;
          return {
            message: "Event not found",
          };
        }

        let eventTemp = {
          ...event,
          attending:
            userId && userId !== "undefined"
              ? event.attendees?.some(
                (attendee) => attendee.toString() === userId,
              )
              : false,
        };

        return {
          event: eventTemp,
          ok: true,
        };
      } catch (error: any) {
        console.log(error);
        set.status = 500;
        return {
          message: error,
        };
      }
    },
    {
      query: t.Object({
        eventId: t.String(),
        userId: t.String(),
      }),
      detail: {
        description: "Get an event",
        summary: "Get an event",
      },
    },
  )
  .get(
    "/admin-events",
    async ({ set, query }) => {
      try {
        const { page, limit } = query;
        const _page = Number(page) || 1;
        const _limit = Number(limit) || 10;

        const events = await AdminEventModel.find()
          .sort({ createdAt: -1, _id: -1 })
          .skip((_page - 1) * _limit)
          .limit(_limit)
          .select("-unnecessaryField")
          .lean();

        set.status = 200;
        return { events, ok: true };
      } catch (error: any) {
        console.log(error);
        set.status = 500;
        return { ok: false, message: "Internal Server Error" };
      }
    },
    {
      detail: {
        summary: "Admni Events ",
        description: "Admin events",
      },
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    },
  )
  .post(
    "/generatepdf",
    async ({ set, query, }) => {
      if (!query.eventId) {
        set.status = 400;
        return {
          message: "Event Id is required",
          ok: false,
        };
      }

      let browser;
      try {

        const event: any = await AdminEventModel.findById(query.eventId)

        if (!event) {
          set.status = 40;
          return {
            message: "Event not Found",
            ok: false,
          };
        }

        let content = await Bun.file("html/template.html").text();
        content = content
          .replace("{{ticket_ID}}", event._id)
          .replace("{{EventName}}", event.eventName)
          .replace("{{Date}}", event.createdAt)
          .replace("{{Location}}", event.location)
          .replace("{{UserName}}", "Sudhan")
          .replace("{{BookingDate}}", "21 Oct 2025 ")
          .replace("{{totalTickets}}", "5")
          .replace("{{Amount}}", "500")
          .replace("{{GST}}", "0")
          .replace("{{TotalAmount}}", "2500")

        let uniqeInvoiceName =
          "ticket" + Math.round(Math.random() * 1000000) + ".pdf";

        browser = await puppeteer.launch({
          headless: true,
          browser: "chrome",
          // executablePath:
          //   ".cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome",
          // args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        await page.setViewport({
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        });
        await page.setContent(content);

        const pdfPath = path.join(process.cwd(), uniqeInvoiceName);

        await page.pdf({
          path: pdfPath,
          format: "A4",
          scale: 1,
          printBackground: true,
          waitForFonts: true,
        });

        const file = Bun.file(pdfPath);
        const buffer = await file.arrayBuffer();
        const blob = new Blob([buffer], { type: "application/pdf" });

        set.headers["Content-Type"] = "application/pdf";
        set.headers["Content-Disposition"] = `attachment; filename=invoice.pdf`;

        // await unlink(pdfPath);

        if (browser) {
          browser.close();
        }

        return blob;
      } catch (error) {
        set.status = 400;
        console.error(error);
        return {
          message: error instanceof Error ? error.message : "Unknown error",
          ok: false,
        };
      } finally {
        if (browser) {
          // @ts-ignore
          await browser.close();
        }
      }
    },
    {
      query: t.Object({
        eventId: t.String(),
      }),
      detail: {
        summary: "Paid Event pdf ",
        description: "Paid Event pdf ",
      },
    }
  );
