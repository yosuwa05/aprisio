import { Schema, Types, model } from "mongoose";

type Rules = {
  heading: string;
  subHeading: string;
};

type IEvent = {
  eventName: string;
  location: string;
  date: Date;
  managedBy: Types.ObjectId;
  rules: Rules[];
  group: Types.ObjectId;
  isEventEnded: boolean;
  attendees: Types.ObjectId[];
  commentsCount: number;
  isManagedByAdmin: boolean;
  eventImage: string;
  eventsDateString: string;
};

const EventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    rules: [
      {
        heading: { type: String },
        subHeading: { type: String },
      },
    ],
    managedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    commentsCount: { type: Number, default: 0 },
    isEventEnded: { type: Boolean, default: false },
    eventImage: { type: String, default: "" },
    eventsDateString: { type: String, default: "" },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isManagedByAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const EventModel = model<IEvent>("Event", EventSchema);
