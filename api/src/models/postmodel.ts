import { Schema, Types, model } from "mongoose";

interface IPost {
  title: string;
  description: string;
  slug: string;
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  likesCount: number; // Real field
  commentsCount: number; // Real field
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String },
    description: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PostModel = model<IPost>("Post", PostSchema);
