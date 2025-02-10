import { Schema, model } from "mongoose";

const userSubTopicSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subTopicId: {
      type: Schema.Types.ObjectId,
      ref: "SubTopic",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

userSubTopicSchema.index({ userId: 1, subTopicId: 1 }, { unique: true });

export const UserSubTopicModel = model("UserSubTopic", userSubTopicSchema);
