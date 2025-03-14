import { EventModel, UserModel } from "@/models";
import { AdminEventModel } from "@/models/admin-events.model";
import { GroupModel } from "@/models/group.model";
import Elysia, { t } from "elysia";
import puppeteer from "puppeteer";
import { unlink } from "fs/promises";
import path from "path";
import { TicketModel } from "@/models/ticket-tracking";
import { StoreType } from "@/types";
import axios from "axios";
import { parseISO, format, isValid } from 'date-fns';


function formatDateForPDF(dateString: any) {
  if (!dateString) {
    return "Date not available";
  }

  let date;

  if (typeof dateString === "string") {
    date = parseISO(dateString);
  } else {
    date = new Date(dateString);
  }

  if (!isValid(date)) {
    console.error("Invalid date format:", dateString);
    return "Invalid Date";
  }

  return format(date, "MMM dd, yyyy HH:mm");
}


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


export const EventsController = new Elysia({
  prefix: "/events",
  detail: {
    tags: ["User - Events"],
  },
})
  .post(
    "/attendevent",
    async ({ body, store, set }) => {
      const { eventId } = body;
      try {
        const userId = (store as any)["id"];

        const event = await EventModel.findOne({ _id: eventId });


        if (!event) {
          set.status = 400;
          return {
            error: "Event not found",
            ok: false,
          };
        }

        if (event.isEventEnded) {
          set.status = 400;
          return {
            error: "Event is ended",
            ok: false,
          };
        }

        if (!event.attendees.includes(userId)) {
          event.attendees.push(userId);
          await event.save();
          return {
            message: "Event attended successfully",
            ok: true,
          };
        } else {
          set.status = 400
          return {
            message: "Already attended",
            ok: false,
          };
        }
      } catch (error) {
        return {
          error,
          ok: false,
        };
      }
    },
    {
      body: t.Object({
        eventId: t.String(),
      }),
      detail: {
        description: "Attend an event",
        summary: "Attend an event",
      },
    }
  )
  .post(
    "/create",
    async ({ body, store }) => {
      try {
        const userId = (store as any)["id"];

        const { eventDate, location, eventName, eventRules, groupSelected, eventType, eventTime } =
          body;

        const group = await GroupModel.findById(groupSelected);

        if (!group) {
          return {
            message: "Group not found",
            ok: false,
          };
        }

        let eventRulesData = {
          total: 0,
          events: [],
        };

        if (eventRules) eventRulesData = JSON.parse(eventRules);

        const newEvent = new EventModel({
          date: eventDate,
          name: eventName,
          rules: eventRulesData.events,
          eventName,
          location,
          group: group._id,
          attendees: [],
          isEventEnded: false,
          managedBy: userId,
          eventType: eventType,
          eventTime: eventTime,
        });

        await newEvent.save();

        return {
          message: "Event created successfully",
          ok: true,
        };
      } catch (error) {
        return {
          error,
          ok: false,
        };
      }
    },
    {
      body: t.Object({
        location: t.Optional(t.String()),
        eventName: t.Optional(t.String()),
        eventRules: t.Optional(t.String()),
        eventDate: t.Optional(t.String()),
        groupSelected: t.String(),
        eventType: t.String(),
        eventTime: t.String(),
      }),
      detail: {
        description: "Create an event",
        summary: "Create an event",
      },
    }
  )
  .put("/edit", async ({ set, body, store }) => {
    try {
      const userId = (store as any)["id"];
      const { eventId, eventDate, location, eventName, eventRules, groupSelected } = body;

      const event = await EventModel.findById(eventId);

      if (!event) {
        set.status = 400
        return {
          message: "Event not found",
          ok: false,
        };
      }

      if (event.managedBy.toString() !== userId) {
        set.status = 400
        return {
          message: "You are not authorized to edit this event",
          ok: false,
        };
      }

      let updateFields: any = {}
      if (eventDate) updateFields.date = eventDate;
      if (location) updateFields.location = location;
      if (eventName) updateFields.eventName = eventName;
      if (eventRules) {
        const parsedRules = JSON.parse(eventRules);
        updateFields.rules = parsedRules.events || [];
      }

      if (groupSelected) {
        const group = await GroupModel.findById(groupSelected);
        if (!group) {
          return {
            message: "Group not found",
            ok: false,
          };
        }
        updateFields.group = group._id;
      }
      await EventModel.findByIdAndUpdate(eventId, updateFields, { new: true });

      return {
        message: "Event updated successfully",
        ok: true,
      };

    } catch (error: any) {
      console.log(error)
      set.status = 500
      return {
        message: error
      }
    }
  }, {
    body: t.Object({
      location: t.Optional(t.String()),
      eventName: t.Optional(t.String()),
      eventRules: t.Optional(t.String()),
      eventDate: t.Optional(t.String()),
      groupSelected: t.String(),
      eventId: t.String(),
    }),
    detail: {
      description: "Create an event",
      summary: "Create an event",
    },
  })
  .post("/decline-event", async ({ set, query, store }) => {
    try {

      const { eventId } = query
      const userId = (store as any)["id"];
      const event = await EventModel.findById(eventId)

      if (!event) {
        set.status = 400
        return {
          message: "Event not found",
          ok: false,
        };
      }

      const isUserParticipated = event.attendees.includes(userId)

      if (!isUserParticipated) {
        set.status = 400;
        return {
          message: "You are not a participant of this event",
          ok: false,
        };
      }

      await EventModel.findByIdAndUpdate(eventId, {
        $pull: { attendees: userId }
      })

      set.status = 200;
      return {
        message: "event declined successfully",
        ok: true,
      };

    } catch (error: any) {
      console.log(error)
      set.status = 500
      return {
        message: error
      }
    }
  }, {
    detail: {
      summary: "Decline Event",
      description: "Decline Event"
    },
    query: t.Object({
      eventId: t.String()
    })
  })
  .get("/group-events", async ({ set, store, query }) => {
    try {
      const userId = (store as any)["id"];
      const { page, limit, groupId } = query;

      if (!groupId) {
        set.status = 400;
        return { ok: false, message: "Group ID is required" };
      }

      const _page = Number(page) || 1;
      const _limit = Number(limit) || 10;

      const events = await EventModel.find({
        group: groupId,
        managedBy: { $ne: userId },
      })
        .populate("group", "name slug")
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
  }, {
    detail: {
      summary: "Group Events Excluding User",
      description: "Fetch events from a group where the user is not an attendee and does not manage the event.",
    },
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      groupId: t.String(),
    }),
  })
  .get("/admin-events", async ({ set, query }) => {
    try {
      const { page, limit } = query;
      const _page = Number(page) || 1;
      const _limit = Number(limit) || 10;

      const events = await AdminEventModel.find({
      })
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
  }, {
    detail: {
      summary: "Admin Events ",
      description: "Admin events",
    },
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
  })
  .get("/viewadmin-event", async ({ set, query }) => {
    try {
      const { eventId } = query;
      const event = await AdminEventModel.findById(eventId)

      if (!event) {
        set.status = 400
        return {
          message: "Event not fonund"
        }
      }
      set.status = 200;
      return { event, ok: true };

    } catch (error: any) {
      console.log(error);
      set.status = 500;
      return { ok: false, message: "Internal Server Error" };
    }
  }, {
    detail: {
      summary: "Admin Events ",
      description: "Admin events",
    },
    query: t.Object({
      eventId: t.String()
    }),
  })
  .get("/paidtickets", async ({ set, store, query }) => {
    try {
      const userId = (store as StoreType)["id"];
      console.log(userId)
      const { page, limit } = query;
      const _page = Number(page) || 1;
      const _limit = Number(limit) || 10;
      const tickets = await TicketModel.find({
        userId
      })
        .populate("eventId")
        .sort({ createdAt: -1, _id: -1 })
        .skip((_page - 1) * _limit)
        .limit(_limit)
        .lean();

      set.status = 200;
      return { tickets, ok: true };

    } catch (error: any) {
      console.log(error)
      set.status = 500
      return {
        message: error
      }
    }
  })
  .get("/generatepdf", async ({ query, set }) => {
    try {
      const { id } = query;

      const ticket: any = await TicketModel.findById(id);

      if (!ticket) {
        return { message: "Ticket not found" };
      }

      let browser;

      const event: any = await AdminEventModel.findById(ticket.eventId);
      const user: any = await UserModel.findById(ticket.userId)

      if (!user) {
        set.status = 40;
        return {
          message: "User not Found",
          ok: false,
        };
      }
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
        .replace("{{title}}", ticket?.tickets?.ticketId)
        .replace("{{ticket_ID}}", ticket?.tickets?.ticketId)
        .replace("{{EventName}}", event?.eventName)
        .replace("{{Date}}", formatDateForPDF(event?.datetime))
        .replace("{{Location}}", event?.location)
        .replace("{{UserName}}", ticket?.name || user?.name)
        .replace("{{BookingDate}}", formatDateForPDF(ticket?.createdAt))
        .replace("{{totalTickets}}", ticket?.ticketCount)
        .replace("{{Amount}}", ticket?.amount)
        .replace("{{GST}}", ticket?.gst)
        .replace("{{imageUrl}}", base64Image)
        .replace("{{TotalAmount}}", ticket?.amount);

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


