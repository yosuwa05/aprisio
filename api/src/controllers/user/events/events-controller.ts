import { EventModel } from "@/models";
import Elysia, { t } from "elysia";

export const EventsController = new Elysia({
  prefix: "/events",
  detail: {
    summary: "Events controller",
    tags: ["User - Events"],
  },
}).post(
  "/attendevent",
  async ({ body, store }) => {
    const { eventId } = body;
    try {
      const userId = (store as any)["id"];

      const event = await EventModel.findOne({ _id: eventId });

      if (!event) {
        return {
          error: "Event not found",
          ok: false,
        };
      }

      if (!event.attendees.includes(userId)) {
        event.attendees.push(userId);

        await event.save();

        return {
          message: "User attended event",
          ok: true,
        };
      } else {
        return {
          error: "User already attended",
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
  }
);
