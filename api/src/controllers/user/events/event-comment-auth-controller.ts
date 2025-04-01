import { sendNotification } from "@/lib/firebase";
import { EventModel, UserModel } from "@/models";
import { EventCommentLikeModel } from "@/models/event-commentlikes";
import { EventCommentModel } from "@/models/event-comments";
import { NotificationModel } from "@/models/notificationmodel";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";

export const EventscommentsController = new Elysia({
  prefix: "/event-comment",
  detail: {
    tags: ["User Event Comment"],
  },
})
  .post(
    "/",
    async ({ body, set, store }) => {
      const { eventId, content, parentCommentId } = body;

      try {
        const userId = (store as StoreType)["id"];

        const newComment = new EventCommentModel({
          user: userId,
          event: eventId,
          content,
          parentComment: parentCommentId || null,
        });

        await newComment.save();

        await EventModel.findByIdAndUpdate(eventId, {
          $inc: { commentsCount: 1 },
        });

        const event = await EventModel.findById(eventId).lean();

        if (event) {
          const user = await UserModel.findById(event.managedBy).lean();

          if (user && user.fcmToken) {
            await sendNotification(
              user.fcmToken,
              "Someone commented on your Event",
              "Someone commented on the event: " + event.eventName,
            );

            const newNotification = new NotificationModel({
              user: user._id,
              type: "event-comment",
              content: "Your post has been commented on.",
              from: userId,
              event: eventId,
              title: "New Comment",
            });
            await newNotification.save();
          }
        }

        set.status = 201;
        return {
          message: "Comment added successfully",
          ok: true,
          comment: newComment,
        };
      } catch (error: any) {
        console.error("Error adding comment:", error);
        set.status = 500;
        return {
          message: "An error occurred while adding the comment.",
          ok: false,
        };
      }
    },
    {
      body: t.Object({
        eventId: t.String(),
        content: t.String(),
        parentCommentId: t.Optional(t.String()),
      }),
      detail: {
        description: "Add a comment to the event",
        summary: "Add a comment to the event",
      },
    }
  )
  .post(
    "/like",
    async ({ body, set, store }) => {
      const { commentId } = body;

      try {
        const userId = (store as StoreType)["id"];

        try {
          const existingLike = await EventCommentLikeModel.findOne({
            user: userId,
            comment: commentId,
          });

          if (existingLike) {
            await EventCommentLikeModel.deleteOne({ _id: existingLike._id });
            await EventCommentModel.findByIdAndUpdate(commentId, {
              $inc: { likesCount: -1 },
              $pull: { likedBy: userId },
            }).exec();

            set.status = 200;
            return { message: "Comment unliked", ok: true };
          }

          const newLike = new EventCommentLikeModel({
            user: userId,
            comment: commentId,
          });
          await newLike.save();
          await EventCommentModel.findByIdAndUpdate(commentId, {
            $inc: { likesCount: 1 },
            $addToSet: { likedBy: userId },
          }).exec();

          set.status = 200;
          return { message: "Comment liked", ok: true };
        } catch (error) {
          throw error;
        }
      } catch (error: any) {
        console.error("Error liking/unliking comment:", error);

        set.status = 500;
        return {
          message:
            "An internal error occurred while processing the like/unlike.",
          ok: false,
        };
      }
    },
    {
      body: t.Object({
        commentId: t.String(),
      }),
      detail: {
        description: "Like or unlike Event   comment",
        summary: "Like or unlike Event  comment",
      },
    }
  )
  .delete("/", async ({ body, set, store }) => {
    try {
      const { commentId } = body;

      const comment = await EventCommentModel.findById(commentId);

      if (!comment) {
        set.status = 400;
        return { message: "Comment not found" };
      }

      if (comment.user.toString() !== (store as StoreType)["id"]) {
        set.status = 403;
        return { message: "You are not authorized to delete this comment" };
      }

      const childComments = await EventCommentModel.find({ parentComment: commentId });

      if (childComments.length > 0) {
        await EventCommentModel.deleteMany({ parentComment: commentId });
      }

      await EventCommentModel.findByIdAndDelete(commentId);

      set.status = 200;
      return { message: "Comment deleted" };
    } catch (error: any) {
      console.error(error);
      set.status = 500;
      return { message: "Internal server error" };
    }
  }, {
    body: t.Object({
      commentId: t.String(),
    }),
    detail: {
      description: "Delete a comment",
      summary: "Delete a comment",
    },
  })


