import { Schema, Types, model } from "mongoose";

interface ITicketEntry {
  ticketId: string;
  ticketPdf: string;
}

interface ITicket {
  userId: string;
  eventId: string;
  ticketPrice: number;
  amount: number;
  gst: number;
  tickets: ITicketEntry[];
  paymentTrack: Types.ObjectId;
}

const TicketEntrySchema = new Schema<ITicketEntry>({
  ticketId: { type: String, required: true },
  ticketPdf: { type: String, required: true },
});

const TicketSchema = new Schema<ITicket>(
  {
    userId: { type: String, default: "" },
    eventId: { type: String, default: "" },
    ticketPrice: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    tickets: [TicketEntrySchema],
    paymentTrack: { type: Schema.Types.ObjectId, default: "" },
  },
  {
    timestamps: true,
  }
);

export const TicketModel = model<ITicket>("Tickets", TicketSchema);
