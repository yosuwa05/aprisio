import { EventModel, UserModel } from "@/models";
import { GroupModel } from "@/models/group.model";
import { SubTopicModel } from "@/models/subtopicmodel";
import { TopicModel } from "@/models/topicsmodel";
import Elysia, { t } from "elysia";


export const AdminDashBoardController = new Elysia({
    prefix: "/dashboard",
    detail: {
        tags: ["Admin - Dashboard"],
    },
})

    .get("/counts", async ({ set }) => {
        try {

            const totalUsers = await UserModel.countDocuments({});
            const totalGroups = await GroupModel.countDocuments({});
            const totalTopics = await TopicModel.countDocuments({});
            const totalSubTopics = await SubTopicModel.countDocuments({});
            const totalLiveEvents = await EventModel.countDocuments({
                isEventEnded: false
            });
            const totalExpiredEvents = await EventModel.countDocuments({
                isEventEnded: true
            });


            set.status = 200
            return {
                totalUsers,
                totalGroups,
                totalTopics,
                totalSubTopics,
                totalLiveEvents,
                totalExpiredEvents,
                message: "Dashboard count successfully"
            }

        } catch (error: any) {
            console.log(error);
            set.status = 500
            return {
                message: error
            }
        }
    }, {
        detail: {
            summary: "Admin Dashboard Counts",
            description: "Admin Dashboard Counts"
        }
    })