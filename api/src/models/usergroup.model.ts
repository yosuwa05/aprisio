import { Schema, model } from "mongoose";

const usersGroupsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

usersGroupsSchema.index({ userId: 1, group: 1 }, { unique: true });

export const UserGroupsModel = model("UserGroups", usersGroupsSchema);
