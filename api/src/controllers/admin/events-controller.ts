import { saveFile } from "@/lib/file-s3";
import { AdminEventModel } from "@/models/admin-events.model";
import Elysia, { t } from "elysia";

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
      const { datetime, eventImage, eventName, location, eventType, price, availableTickets, mapLink, expirydatetime, organiserName, biography, description } = body;

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

        let finalDate = new Date(JSON.parse(datetime));
        let _finalDate = new Date(JSON.parse(expirydatetime));

        // Check if conversion is successful
        if (isNaN(finalDate.getTime()) || isNaN(_finalDate.getTime())) {
          throw new Error("Invalid date format received");
        }

        const newTopic = new AdminEventModel({
          eventName,
          datetime: finalDate,
          expirydatetime: _finalDate,
          attendees: [],
          mapLink: mapLink || "",
          organiserName: organiserName || "",
          biography: biography || "",
          eventImage: file,
          location,
          isEventEnded: false,
          managedBy: null,
          // rules: JSON.parse(eventRules),
          eventsDateString: datetime,
          eventType,
          price,
          availableTickets,
          description
        });

        await newTopic.save();

        set.status = 200;
        return { message: "Topic created successfully", ok: true };
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
        // eventRules: t.String(),
        eventImage: t.File(),
        eventType: t.String(),
        price: t.String(),
        availableTickets: t.String(),
        mapLink: t.String(),
        organiserName: t.String(),
        biography: t.String(),
        description: t.String()
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
  );
