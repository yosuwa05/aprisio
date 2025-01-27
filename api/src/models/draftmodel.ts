import { Schema, Types, model } from "mongoose";

interface IDraft {
  user: Types.ObjectId;
  title: string;
  description: string;
  content: string;
}

const DraftSchema = new Schema<IDraft>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

DraftSchema.index({ user: 1 });

export const DraftModel = model<IDraft>("Draft", DraftSchema);
