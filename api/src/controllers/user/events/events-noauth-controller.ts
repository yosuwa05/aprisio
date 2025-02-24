import { EventModel } from "@/models";
import Elysia, { t } from "elysia";

export const EventsNoAuthController = new Elysia({
  prefix: "/events/noauth",
  detail: {
    tags: ["User - Events - NoAuth"],
  },
}).get(
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
                (attendee) => attendee.toString() === userId
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
  }
);
