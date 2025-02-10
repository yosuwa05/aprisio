import { model, Schema, Types } from "mongoose";

interface IGroup {
  name: string;
  description: string;
  events: [];
  images: [];
  members: Types.ObjectId[];
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
  },
  {
    timestamps: true,
  }
);

export const GroupModel = model<IGroup>("Group", GroupSchema);
