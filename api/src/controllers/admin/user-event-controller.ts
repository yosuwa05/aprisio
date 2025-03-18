import { EventModel } from "@/models";
import Elysia, { t } from "elysia";

export const UserEventController = new Elysia({
    prefix: "/user-event",
    detail: {
        tags: ["Admin - User Events"],
    },
})

    .get(
        "/all",
        async ({ set, query }) => {
            try {
                const { page = 1, limit = 10, q, filter } = query;

                const searchQuery: any = {};

                if (q) {
                    searchQuery.$or = [{ eventName: { $regex: q, $options: "i" } }];
                }

                if (filter !== undefined) {
                    searchQuery.isApprovedByAdmin = filter === "true";
                }

                const total = await EventModel.countDocuments(searchQuery);

                const events = await EventModel.find(searchQuery)
                    .populate("group", "name  ")
                    .populate("managedBy", "name")
                    .select("group managedBy eventName createdAt isApprovedByAdmin isEventEnded ")
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit);

                set.status = 200;
                return {
                    message: "User events fetched successfully",
                    events,
                    total,
                };
            } catch (error) {
                console.log(error);
                set.status = 500;
                return {
                    message: "Internal Server Error",
                    error,
                };
            }
        },
        {
            query: t.Object({
                page: t.Optional(t.Number()),
                limit: t.Optional(t.Number()),
                q: t.Optional(t.String()),
                filter: t.Optional(t.String()),
            }),
            detail: {
                summary: "Get all user events",
                description: "Get all user events",
            },
        }
    )
    .get(
        "/view-event",
        async ({ set, query }) => {
            try {
                const { eventId } = query;
                const isEventExist = await EventModel.findById(eventId)

                if (!isEventExist) {
                    set.status = 400;
                    return {
                        message: "Event not found"
                    }
                }

                const Event = await EventModel.findById(eventId)
                    .populate({
                        path: "group",
                        select: "name",
                        populate: {
                            path: "subTopic",
                            select: "subTopicName",
                            populate: {
                                path: "topic",
                                select: "topicName"
                            }
                        }
                    })
                    .populate("managedBy", "name")


                set.status = 200;
                return {
                    Event
                };
            } catch (error) {
                console.log(error);
                set.status = 500;
                return {
                    message: "Internal Server Error",
                    error,
                };
            }
        },
        {
            query: t.Object({
                eventId: t.String()
            }),
            detail: {
                summary: "View Event",
                description: "View Event",
            },
        }
    )
    .post(
        "/approve/:id",
        async ({ params }) => {
            try {
                const { id } = params;

                const event = await EventModel.findById(id);
                if (!event) {
                    return { message: "Event not found" };
                }

                event.isApprovedByAdmin = !event.isApprovedByAdmin;
                await event.save();

                return {
                    message: "Status updated successfully",
                };
            } catch (error) {
                console.log(error);
                return {
                    message: error
                };
            }
        },
        {
            params: t.Object({
                id: t.String(),
            }),
            detail: {
                summary: "Approve or disapprove an event",
            },
        }
    );
