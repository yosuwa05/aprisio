import { Schema, Types, model } from "mongoose";

interface IPost {
  title: string;
  description: string;
  slug: string;
  author: Types.ObjectId;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const PostModel = model<IPost>("Post", PostSchema);
