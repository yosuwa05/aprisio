import { Schema, Types, model } from "mongoose";

interface ICommentLike {
  user: Types.ObjectId;
  comment: Types.ObjectId;
}

const CommentLikeSchema = new Schema<ICommentLike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
  },
  { timestamps: true }
);

CommentLikeSchema.index({ user: 1, comment: 1 }, { unique: true });

export const CommentLikeModel = model<ICommentLike>(
  "CommentLike",
  CommentLikeSchema
);
