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
          attendees: [],
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
  });

