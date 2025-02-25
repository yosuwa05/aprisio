import { saveFile } from "@/lib/file-s3";
import { EventModel } from "@/models";
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
      const { date, eventImage, eventName, location, eventRules } = body;

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

        let formatedDate = JSON.parse(date);

        let finalDate = new Date(
          formatedDate.year,
          formatedDate.month - 1,
          formatedDate.day
        );

        const newTopic = new EventModel({
          eventName,
          date: finalDate,
          attendees: [],
          commentsCount: 0,
          eventImage: file,
          location,
          group: null,
          isEventEnded: false,
          isManagedByAdmin: true,
          managedBy: null,
          rules: JSON.parse(eventRules),
          eventsDateString: date,
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
        date: t.String(),
        location: t.String(),
        eventRules: t.String(),
        eventImage: t.File(),
      }),
      detail: {
        description: "Create topic",
        summary: "Create topic",
      },
    }
  )
  .get(
    "/all",
    async ({ query, set, store }) => {
      const { page = 1, limit = 10, q } = query;

      try {
        const events = await EventModel.find({
          isManagedByAdmin: true,
          eventName: {
            $regex: q,
            $options: "i",
          },
        })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);

        const totalEvents = await EventModel.countDocuments({
          isManagedByAdmin: true,
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
        description: "Get topics",
        summary: "Get topics",
      },
    }
  )
  .delete(
    "/:id",
    async ({ query, set, store, params }) => {
      const { permanent } = query;
      const { id } = params;

      try {
        const event = await EventModel.findById(id);

        if (!event) {
          return {
            message: "Event not found",
          };
        }

        await EventModel.findOneAndDelete({ _id: id });

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
