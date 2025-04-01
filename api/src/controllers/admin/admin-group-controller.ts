import { deleteFile } from "@/lib/file-s3";
import { CommentModel, EventModel, LikeModel, PostModel } from "@/models";
import { CommentLikeModel } from "@/models/commentlikes";
import { EventCommentLikeModel } from "@/models/event-commentlikes";
import { EventCommentModel } from "@/models/event-comments";
import { GroupModel } from "@/models/group.model";
import { GroupPhotoModel } from "@/models/groupphotos.model";
import { GroupPostShareModel } from "@/models/grouppostshare";
import { UserGroupsModel } from "@/models/usergroup.model";
import Elysia, { t } from "elysia";


export const AdminGroupController = new Elysia({
    prefix: "/group-management",
    detail: {
        tags: ["Admin - Group - Management"],
    },
})

    .get(
        "/all",
        async ({ set, query }) => {
            try {
                const { page = 1, limit = 10, q, filter } = query;

                const searchQuery: any = {};

                if (q) {
                    searchQuery.$or = [{ name: { $regex: q, $options: "i" } }];
                }

                if (filter !== undefined) {
                    searchQuery.active = filter === "true";
                }


                const total = await GroupModel.countDocuments(searchQuery);

                const Groups = await GroupModel.find(searchQuery)
                    .populate("subTopic", "subTopicName")
                    .populate("groupAdmin", "name")
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit);

                set.status = 200;
                return {
                    message: "User Groups fetched successfully",
                    Groups,
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
                summary: "Get all user Groups",
                description: "Get all user Groups",
            },
        }
    )
    .post(
        "/statuschange/:id",
        async ({ params }) => {
            try {
                const { id } = params;

                const group = await GroupModel.findById(id);
                if (!group) {
                    return { message: "Group not found" };
                }
                group.active = !group.active;
                await group.save();

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
                summary: "Active or DisActive an Group",
            },
        }
    )
    .delete("/group", async ({ set, query }) => {
        try {
            const { groupId } = query;

            const isGroupExist = await GroupModel.findById(groupId);
            if (!isGroupExist) {
                set.status = 400;
                return { message: "Group not found" };
            }

            const posts = await PostModel.find({ group: groupId });
            const postIds = posts.map(post => post._id);

            if (postIds.length > 0) {

                for (const post of posts) {
                    if (post.image) {
                        deleteFile(post.image);
                    }
                }

                const comments = await CommentModel.find({ post: { $in: postIds } });
                const commentIds = comments.map(comment => comment._id);

                if (commentIds.length > 0) {
                    await CommentLikeModel.deleteMany({ comment: { $in: commentIds } });

                    await CommentModel.deleteMany({ parentComment: { $in: commentIds } });

                    await CommentModel.deleteMany({ post: { $in: postIds } });
                }

                await LikeModel.deleteMany({ post: { $in: postIds } });


                await PostModel.deleteMany({ group: groupId });
            }
            await GroupPostShareModel.deleteMany({ group: groupId });

            await UserGroupsModel.deleteMany({ group: groupId })
            const photos = await GroupPhotoModel.find({ group: groupId })
            const photosId = photos.map(photo => photo._id)
            if (photosId.length > 0) {
                for (const photo of photos) {
                    if (photo.photo) {
                        deleteFile(photo.photo)
                    }
                }
                await GroupPhotoModel.deleteMany({ group: groupId })
            }

            const events = await EventModel.find({ group: groupId });
            const eventIds = events.map(event => event._id);

            if (eventIds.length > 0) {

                const comments = await EventCommentModel.find({ event: { $in: eventIds } });
                const commentIds = comments.map(comment => comment._id);

                if (commentIds.length > 0) {
                    await EventCommentLikeModel.deleteMany({ comment: { $in: commentIds } });

                    await EventCommentModel.deleteMany({ parentComment: { $in: commentIds } });

                    await EventCommentModel.deleteMany({ event: { $in: eventIds } });
                }

                await EventModel.deleteMany({ group: groupId });
            }

            await GroupModel.findByIdAndDelete(groupId);

            set.status = 200;
            return { message: "Group deleted successfully" };

        } catch (error: any) {
            console.error(error);
            set.status = 500;
            return { message: error.message };
        }
    }, {
        query: t.Object({
            groupId: t.String()
        }),
        detail: {
            summary: "Delete Group",
            description: "Deletes a group along with all associated posts, comments, likes, and shares."
        }
    })