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
  datetime: Date;
  eventId: string;
  location: string;
  eventName: string;
  availableTickets: number;
  soldTickets: number;
  price: number;
  expirydatetime: Date;
  organiserName: string;
  biography: string;
  managedBy: Types.ObjectId;
  rules: Rules[];
  mapLink: string;
  isEventEnded: boolean;
  attendees: Types.ObjectId[];
  eventImage: string;
  eventsDateString: string;
  eventType: EventType;
  description: string;
  delta: string;
};

const AdminEventSchema = new Schema<IEvent>(
  {
    datetime: { type: Date, required: true },
    eventId: { type: String, required: true },
    location: { type: String, required: true },
    eventName: { type: String, required: true },
    availableTickets: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    soldTickets: {
      type: Number,
      default: 0,
    },
    delta: { type: String, default: "" },
    mapLink: { type: String, default: "" },
    expirydatetime: { type: Date, required: true },
    organiserName: { type: String },
    biography: { type: String },
    eventType: {
      type: String,
      enum: EventType,
    },

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
    description: { type: String, default: "" },
    isEventEnded: { type: Boolean, default: false },
    eventImage: { type: String, default: "" },
    eventsDateString: { type: String, default: "" },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const AdminEventModel = model<IEvent>("AdminEvents", AdminEventSchema);
