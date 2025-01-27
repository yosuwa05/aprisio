import { Schema, Types, model } from "mongoose";

interface IComment {
  user: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
}

const CommentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

CommentSchema.index({ post: 1 });

export const CommentModel = model<IComment>("Comment", CommentSchema);
