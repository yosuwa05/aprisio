import { Schema, Types, model } from "mongoose";

type Rules = {
  heading: string;
  subHeading: string;
};

type IEvent = {
  eventName: string;
  location: string;
  date: string;
  rules: Rules[];
  group: Types.ObjectId;
};

const EventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    rules: [
      {
        heading: { type: String },
        subHeading: { type: String },
      },
    ],
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  },
  {
    timestamps: true,
  }
);

export const EventModel = model<IEvent>("Event", EventSchema);
