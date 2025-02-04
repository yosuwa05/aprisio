import { Schema, Types, model } from "mongoose";

interface IComment {
  user: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
  parentComment?: Types.ObjectId;
  likesCount: number;
  likedBy: Types.ObjectId[];
}

const CommentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likesCount: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ user: 1 });
CommentSchema.index({ likedBy: 1 });

export const CommentModel = model<IComment>("Comment", CommentSchema);
