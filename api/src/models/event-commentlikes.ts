import { Schema, Types, model } from "mongoose";

interface IEventCommentLike {
    user: Types.ObjectId;
    comment: Types.ObjectId;
}

const EventCommentLikeSchema = new Schema<IEventCommentLike>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: Schema.Types.ObjectId, ref: "EventComment", required: true },
}, {
    timestamps: true
})

EventCommentLikeSchema.index({ user: 1, comment: 1 }, { unique: true });

export const EventCommentLikeModel = model<IEventCommentLike>("EventCommentLike", EventCommentLikeSchema);