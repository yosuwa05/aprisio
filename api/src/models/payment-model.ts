import { model, Schema, Types } from "mongoose";

interface IPayment {
  txnId: string;
  hash: string;
  status: string;
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  formString: string;
  message: string;
  pgResponse: string;
  amount: number;
  ticketCount: number;
  tickets: string[];
}

const PaymentSchema = new Schema<IPayment>(
  {
    txnId: { type: String, required: true },
    hash: { type: String, required: true },
    status: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    eventId: { type: Schema.Types.ObjectId, ref: "Event" },
    formString: { type: String, default: "" },
    message: { type: String, default: "" },
    pgResponse: { type: String, default: "" },
    amount: { type: Number, default: 0 },
    ticketCount: { type: Number, default: 0 },
    tickets: [{ type: String, default: "" }],
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = model<IPayment>("Payment", PaymentSchema);
