import { Schema, Types, model } from "mongoose";

type Rules = {
  heading: string;
  subHeading: string;
};

enum EventType {
  ONLINE = "online",
  OFFLINE = "offline",
}

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
  eventType: EventType;
  eventTime: string;
  amount: number;
  totalTickets: number;
};

const EventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true },
    location: { type: String, required: true },
    eventType: {
      type: String,
      enum: EventType,
    },
    amount: {
      type: Number,
      default: 0
    },
    totalTickets: {
      type: Number,
      default: 0
    },
    eventTime: {
      type: String,
    },
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
