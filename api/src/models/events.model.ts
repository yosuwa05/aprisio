import { Schema, model } from "mongoose";

type Rules = {
  heading: string;
  subHeading: string;
};

type IEvent = {
  eventName: string;
  location: string;
  date: string;
  rules: Rules[];
};

const EventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    rules: [
      {
        type: Schema.Types.ObjectId,
        ref: "EventRule",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const EventModel = model<IEvent>("Event", EventSchema);
