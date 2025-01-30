import { Schema, model } from "mongoose";

interface ITopic {
  topicName: string;
  active: boolean;
  isDeleted: boolean;
}

const TopicSchema = new Schema<ITopic>(
  {
    topicName: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const TopicModel = model<ITopic>("Topic", TopicSchema);
