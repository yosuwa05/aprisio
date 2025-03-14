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
                    .populate("group")
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
    );
