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
  enddatetime: Date;
  eventId: string;
  location: string;
  eventName: string;
  availableTickets: number;
  soldTickets: number;
  reminingTickets: number;
  price: number;
  strikePrice: number;
  duration: number;
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
  ticketPrefix: string;
  lastSoldTicketNumber: number;
  gst: number
  isEventActivated: boolean;
  isDeleted: boolean;
};

const AdminEventSchema = new Schema<IEvent>(
  {
    datetime: { type: Date, default: null },
    enddatetime: { type: Date, default: null },
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
    strikePrice: {
      type: Number,
      default: 0,
    },
    gst: { type: Number, default: 0 },
    soldTickets: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    ticketPrefix: {
      type: String,
      default: "",
    },
    reminingTickets: {
      type: Number,
      default: 0,
    },
    lastSoldTicketNumber: {
      type: Number,
      default: 0,
    },
    delta: { type: String, default: "" },
    mapLink: { type: String, default: "" },
    expirydatetime: { type: Date, default: null },
    organiserName: { type: String },
    biography: { type: String },
    eventType: {
      type: String,
      enum: EventType,
    },
    isEventActivated: {
      type: Boolean,
      default: true
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
    isDeleted: { type: Boolean, default: false },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const AdminEventModel = model<IEvent>("AdminEvents", AdminEventSchema);
