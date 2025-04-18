import { deleteFile } from "@/lib/file-s3";
import { CommentModel, EventModel, LikeModel, PostModel } from "@/models";
import { CommentLikeModel } from "@/models/commentlikes";
import { EventCommentLikeModel } from "@/models/event-commentlikes";
import { EventCommentModel } from "@/models/event-comments";
import { GroupModel } from "@/models/group.model";
import { GroupPhotoModel } from "@/models/groupphotos.model";
import { GroupPostShareModel } from "@/models/grouppostshare";
import { SubTopicModel } from "@/models/subtopicmodel";
import { UserGroupsModel } from "@/models/usergroup.model";
import { UserSubTopicModel } from "@/models/usersubtopic.model";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";

export const DeleteManagementController = new Elysia({
    prefix: "/delete-management",
    detail: {
        tags: ["Client - Users - Delete Management"],
    },
})

    .delete("/post", async ({ set, query }) => {
        try {
            const { postId } = query;

            const isPostExist = await PostModel.findById(postId);
            if (!isPostExist) {
                set.status = 400;
                return { message: "Post not found" };
            }

            const comments = await CommentModel.find({ post: postId });

            const commentIds = comments.map(comment => comment._id);

            if (commentIds.length > 0) {
                await CommentLikeModel.deleteMany({ comment: { $in: commentIds } });
                await CommentModel.deleteMany({ parentComment: { $in: commentIds } });
                await CommentModel.deleteMany({ post: postId });
            }

            await LikeModel.deleteMany({ post: postId });
            await GroupPostShareModel.deleteMany({ postId });

            deleteFile(isPostExist.image)

            await PostModel.findByIdAndDelete(postId);

            set.status = 200;
            return { message: "Post deleted successfully" };

        } catch (error: any) {
            console.log(error);
            set.status = 500;
            return { message: error.message };
        }
    }, {
        query: t.Object({
            postId: t.String()
        }),
        detail: {
            summary: "Delete post",
            description: "Deletes a post "
        }
    })
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
    .post(
        "/unjoin-community",
        async ({ set, body, store }) => {
            try {
                const { subTopicId } = body;
                const userId = (store as StoreType)?.id;
                console.log(userId)
                const subTopic = await SubTopicModel.findById(subTopicId);

                if (!subTopic) {
                    set.status = 400;
                    return {
                        message: "Subtopic not found",
                    };
                }

                const groups = await GroupModel.find({ subTopic: subTopic._id }).select("_id");

                const groupIds = groups.map((group) => group._id);

                const result = await UserGroupsModel.deleteMany({
                    userId,
                    group: { $in: groupIds },
                    role: "member",
                });

                const unJoinSubTopic = await UserSubTopicModel.findOneAndDelete({
                    userId,
                    subTopicId: subTopic._id,
                })

                return {
                    message: "Unjoined successfully",
                    ok: true,
                };
            } catch (error: any) {
                console.log("Unjoin Community Error:", error);
                set.status = 500;
                return {
                    message: "An error occurred while unjoining the community.",
                    error: error.message || error,
                    ok: false,
                };
            }
        },
        {
            detail: {
                summary: "Unjoin Community",
                description: "Unjoin Community",
            },
            body: t.Object({
                subTopicId: t.String()
            })
        }
    );

