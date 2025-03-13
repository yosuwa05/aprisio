import { Schema, Types, model } from "mongoose";

interface ITicketEntry {
  ticketId: string;
  ticketPdf: string;
}

interface ITicket {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  ticketPrice: number;
  amount: number;
  gst: number;
  tickets: ITicketEntry;
  paymentTrack: Types.ObjectId;
  txnId: string;
  ticketCount: number;
}

const TicketEntrySchema = new Schema<ITicketEntry>({
  ticketId: { type: String },
  ticketPdf: { type: String },
});

const TicketSchema = new Schema<ITicket>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    eventId: { type: Schema.Types.ObjectId, default: "" },
    ticketPrice: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    tickets: TicketEntrySchema,
    ticketCount: { type: Number, default: 0 },
    paymentTrack: { type: Schema.Types.ObjectId, default: "" },
    txnId: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const TicketModel = model<ITicket>("Tickets", TicketSchema);
