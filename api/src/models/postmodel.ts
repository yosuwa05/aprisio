import { Schema, Types, model } from "mongoose";

interface IPost {
  title: string;
  description: string;
  slug: string;
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  url: string;
  image: string;
  comments: Types.ObjectId[];
  likesCount: number;
  commentsCount: number;
  subTopic: Types.ObjectId;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String },
    description: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    url: { type: String, default: "" },
    image: { type: String, default: "" },
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
    subTopic: { type: Schema.Types.ObjectId, ref: "subtopics" },
  },
  { timestamps: true }
);

PostSchema.index({ author: 1 });
PostSchema.index({ likes: 1 });

export const PostModel = model<IPost>("Post", PostSchema);
