import { model, Schema, Types } from "mongoose";

interface ISubTopic {
  subTopicName: string;
  topic: Types.ObjectId;
  description: string;
  isDeleted: boolean;
  active: boolean;
}

const subtopicSchema = new Schema<ISubTopic>(
  {
    subTopicName: {
      type: String,
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
    },
    description: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const SubTopicModel = model<ISubTopic>("subtopic", subtopicSchema);
