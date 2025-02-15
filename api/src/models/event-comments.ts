import { Schema, Types, model } from "mongoose"

interface IEventComment {
    user: Types.ObjectId;
    event: Types.ObjectId;
    content: string;
    parentComment?: Types.ObjectId;
    likesCount: number;
    likedBy: Types.ObjectId[];
}

const EventCommentSchema = new Schema<IEventComment>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    content: { type: String, required: true },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: "EventComment",
        default: null,
    },
    likesCount: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
},
    { timestamps: true }
);

EventCommentSchema.index({ event: 1, createdAt: -1 });
EventCommentSchema.index({ user: 1 });
EventCommentSchema.index({ likedBy: 1 });

export const EventCommentModel = model<IEventComment>("EventComment", EventCommentSchema);