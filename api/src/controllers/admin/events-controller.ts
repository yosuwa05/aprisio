import { deleteFile, saveFile } from "@/lib/file-s3";
import { generateEventId, generateTicketPrefix } from "@/lib/utils";
import { AdminEventModel } from "@/models/admin-events.model";
import { TicketModel } from "@/models/ticket-tracking";
import Elysia, { t } from "elysia";
import { formatISO, parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";

function parseCustomDate(dateStr: string): Date | null {
  const cleanDateStr = dateStr.replace(/ (am|pm)$/i, '');
  let parsedDate = parse(cleanDateStr, "yyyy-MM-dd HH:mm", new Date());

  if (isNaN(parsedDate.getTime())) {
    parsedDate = parse(dateStr, "yyyy-MM-dd hh:mm a", new Date());
  }

  return isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export const eventsController = new Elysia({
  prefix: "/events",
  detail: {
    description: "Admin - Events",
    summary: "Admin - Events",
    tags: ["Admin - Events"],
  },
})
  .post(
    "/create",
    async ({ body, set, store }) => {
      const {
        datetime,
        eventImage,
        eventName,
        location,
        eventType,
        price,
        availableTickets,
        mapLink,
        expirydatetime,
        organiserName,
        biography,
        description,
        delta,
        gst,
        duration
      } = body;

      try {
        let file = "";

        if (eventImage) {
          const { filename, ok } = await saveFile(eventImage, "admin-events");

          if (!ok) {
            return {
              message: "An error occurred while uploading the image.",
              ok: false,
            };
          }

          file = filename;
        }

        console.log("Raw datetime:", datetime);
        console.log("Raw expirydatetime:", expirydatetime);



        let finalDate = parseCustomDate(datetime);
        let _finalDate = parseCustomDate(expirydatetime);
        console.log("Parsed datetime:", finalDate);
        console.log("Parsed expirydatetime:", _finalDate);
        if (!finalDate || !_finalDate) {
          throw new Error("Invalid date format received");
        }


        let eventId = generateEventId();
        let ticketPrefix = generateTicketPrefix();

        const newTopic = new AdminEventModel({
          eventName,
          datetime: finalDate,
          expirydatetime: _finalDate,
          attendees: [],
          eventId,
          mapLink: mapLink || "",
          organiserName: organiserName || "",
          biography: biography || "",
          eventImage: file,
          location,
          isEventEnded: false,
          managedBy: null,
          delta,
          ticketPrefix,
          reminingTickets: availableTickets,
          eventsDateString: datetime,
          eventType,
          price,
          availableTickets,
          soldTickets: 0,
          lastSoldTicketNumber: 1,
          description,
          gst,
          duration
        });

        await newTopic.save();

        set.status = 200;
        return { message: "Event created successfully", ok: true };
      } catch (error: any) {
        console.error(error);
        set.status = 500;
        return {
          message: error,
          ok: false,
        };
      }
    },
    {
      body: t.Object({
        eventName: t.String(),
        datetime: t.String(),
        expirydatetime: t.String(),
        location: t.String(),
        duration: t.String(),
        eventImage: t.File(),
        eventType: t.String(),
        price: t.String(),
        gst: t.String(),
        availableTickets: t.String(),
        mapLink: t.String(),
        organiserName: t.String(),
        biography: t.String(),
        description: t.String(),
        delta: t.Optional(
          t.String({
            default: "{}",
          })
        ),
      }),
      detail: {
        description: "Create Event",
        summary: "Create Event",
      },
    }
  )
  .get(
    "/all",
    async ({ query, set, store }) => {
      const { page = 1, limit = 10, q } = query;

      try {
        const events = await AdminEventModel.find({
          eventName: {
            $regex: q,
            $options: "i",
          },
        })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);

        const totalEvents = await AdminEventModel.countDocuments({
          eventName: {
            $regex: q,
            $options: "i",
          },
        });

        return {
          events,
          total: totalEvents,
          ok: true,
        };
      } catch (error: any) {
        console.error(error);
        set.status = 500;
        return {
          message: "An internal error occurred while fetching topics.",
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
        q: t.Optional(t.String()),
      }),
      detail: {
        description: "Get Events",
        summary: "Get Events",
      },
    }
  )
  .delete(
    "/:id",
    async ({ query, set, store, params }) => {
      const { permanent } = query;
      const { id } = params;

      try {
        const event = await AdminEventModel.findById(id);

        if (!event) {
          return {
            message: "Event not found",
          };
        }

        await AdminEventModel.findOneAndDelete({ _id: id });

        set.status = 200;
        return {
          message: "Event Deleted Successfully",
          ok: true,
        };
      } catch (error: any) {
        set.status = 500;
        return {
          message: "An internal error occurred while deleting event.",
          ok: false,
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        permanent: t.Optional(t.Boolean()),
      }),
      detail: {
        description: "Delete event",
        summary: "Delete event",
      },
    }
  )
  .put(
    "/:id",
    async ({ set, params, body }) => {
      const { id } = params;

      try {
        const {
          eventImage,
          eventName,
          location,
          eventType,
          organiserName,
          price,
          availableTickets,
          mapLink,
          expirydatetime,
          datetime,
          biography,
          description,
          delta,
          gst,
          duration
        } = body;

        const event = await AdminEventModel.findById(id);

        if (!event) {
          return {
            message: "Event not found",
          };
        }

        let fileName = "";

        if (eventImage) {
          const { filename, ok } = await saveFile(eventImage, "admin-events");

          if (!ok) {
            return {
              message: "An error occurred while uploading the image.",
              ok: false,
            };
          }

          deleteFile(event.eventImage);

          fileName = filename;
        }

        event.eventName = eventName || event.eventName;
        // @ts-ignore
        event.datetime = parseCustomDate(datetime) || event.datetime;
        // @ts-ignore
        event.expirydatetime = parseCustomDate(expirydatetime) || event.expirydatetime;
        event.location = location || event.location;
        event.price = Number(price ?? 0) || event.price;
        event.availableTickets =
          Number(availableTickets ?? 0) || event.availableTickets;
        event.mapLink = mapLink || event.mapLink;
        event.organiserName = organiserName || event.organiserName;
        event.biography = biography || event.biography;
        event.description = description || event.description;
        event.delta = delta || event.delta;
        event.gst = Number(gst ?? 0) || event.gst;
        event.duration = Number(duration ?? 0) || event.duration;

        if (fileName) {
          event.eventImage = fileName;
        }

        await event.save();

        set.status = 200;
        return {
          message: "Event Updated Successfully",
          ok: true,
        };
      } catch (error: any) {
        set.status = 500;
        console.log(error);
        return {
          message: error,
          ok: false,
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        eventName: t.Optional(t.String()),
        datetime: t.Optional(t.String()),
        expirydatetime: t.Optional(t.String()),
        location: t.Optional(t.String()),
        eventImage: t.Optional(t.File()),
        eventType: t.Optional(t.String()),
        price: t.Optional(t.String()),
        availableTickets: t.Optional(t.String()),
        organiserName: t.Optional(t.String()),
        mapLink: t.Optional(t.String()),
        gst: t.Optional(t.String()),
        duration: t.Optional(t.String()),
        biography: t.Optional(t.String()),
        description: t.Optional(t.String()),
        delta: t.Optional(t.String()),
      }),
      detail: {
        description: "Update event",
        summary: "Update event",
      },
    }
  )
  .get(
    "/:id",
    async ({ params, set, store }) => {
      const { id } = params;

      try {
        const event = await AdminEventModel.findById(id);

        if (!event) {
          return {
            message: "Event not found",
          };
        }
        const eventDateIST = toZonedTime(event.datetime, "Asia/Kolkata");
        const formattedDateIST = formatISO(eventDateIST, { representation: "complete" });
        console.log(formattedDateIST)
        //@ts-ignore
        event.datetime = formattedDateIST;
        return {
          event
        }
      } catch (error: any) {
        set.status = 500;
        return {
          message: "An internal error occurred while fetching event.",
          ok: false,
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        description: "Get event",
        summary: "Get event",
      },
    }
  )
  .get(
    "/ticketusers",
    async ({ query }) => {
      try {
        const { page = 1, limit = 10, q, eventId } = query;

        if (!eventId) {
          return {
            ok: false,
            error: "eventId is required",
          };
        }

        const searchQuery: any = { eventId };

        if (q) {
          searchQuery.$or = [
            { txnId: { $regex: q, $options: "i" } },
            { "tickets.ticketId": { $regex: q, $options: "i" } },
            { "userId.name": { $regex: q, $options: "i" } },
          ];
        }

        const total = await TicketModel.countDocuments(searchQuery);
        const ticketusers = await TicketModel.find(searchQuery)
          .populate("userId", "name email mobile")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);

        return {
          ticketusers,
          total,
          ok: true,
        };
      } catch (error: any) {
        console.error(error);
        return {
          ok: false,
          error: error.message,
        };
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
        q: t.Optional(t.String()),
        eventId: t.String(),
      }),
    }
  )
  .get(
    "/All-tickets",
    async ({ query }) => {
      try {
        const { eventId } = query;

        if (!eventId) {
          return {
            ok: false,
            error: "eventId is required",
          };
        }

        const searchQuery: any = { eventId };
        const total = await TicketModel.countDocuments(searchQuery);
        const ticketusers = await TicketModel.find(searchQuery)
          .populate("userId", "name email mobile")
          .sort({ createdAt: -1 })

        if (!ticketusers) {
          return {
            ok: false,
            error: "No tickets found",
          };
        }

        const alltickets = ticketusers.map((ticket) => {
          return {
            name: ticket?.name,
            mobile: ticket?.mobileNumber,
            emailId: ticket?.emailId,
            ticketId: ticket?.tickets?.ticketId,
            ticketCount: ticket?.ticketCount,
            amount: ticket?.amount,
          };
        })

        return {
          alltickets: alltickets || [],
          total,
          ok: true,
        };
      } catch (error: any) {
        console.error(error);
        return {
          ok: false,
          error: error.message,
        };
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
        q: t.Optional(t.String()),
        eventId: t.String(),
      }),
    }
  );
