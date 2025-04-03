import { Schema, model } from "mongoose";

interface ITopic {
  topicName: string;
  active: boolean;
  isDeleted: boolean;
  popularity: number;
}

const TopicSchema = new Schema<ITopic>(
  {
    topicName: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    popularity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TopicModel = model<ITopic>("Topic", TopicSchema);
