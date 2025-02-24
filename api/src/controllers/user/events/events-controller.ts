import { EventModel } from "@/models";
import { GroupModel } from "@/models/group.model";
import Elysia, { t } from "elysia";

export const EventsController = new Elysia({
  prefix: "/events",
  detail: {
    tags: ["User - Events"],
  },
})
  .post(
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
            message: "Event attended successfully",
            ok: true,
          };
        } else {
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

        const { eventDate, location, eventName, eventRules, groupSelected } =
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
          attendees: [userId],
          isEventEnded: false,
          managedBy: userId,
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
      }),
      detail: {
        description: "Create an event",
        summary: "Create an event",
      },
    }
  );
