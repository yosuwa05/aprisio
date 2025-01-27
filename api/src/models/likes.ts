import { Schema, Types, model } from "mongoose";

interface ILike {
  user: Types.ObjectId;
  post: Types.ObjectId;
}

const LikeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

LikeSchema.index({ user: 1, post: 1 }, { unique: true });

export const LikeModel = model<ILike>("Like", LikeSchema);
