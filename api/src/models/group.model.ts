import { model, Schema, Types } from "mongoose";

interface IGroup {
  name: string;
  description: string;
  events: Types.ObjectId[];
  images: [];
  members: Types.ObjectId[];
  subTopic: Types.ObjectId;
  groupAdmin: Types.ObjectId;
}

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    images: [],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    subTopic: {
      type: Schema.Types.ObjectId,
      ref: "subtopics",
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const GroupModel = model<IGroup>("Group", GroupSchema);
