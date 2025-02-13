import { Schema, Types, model } from "mongoose";

interface IUserGroup {
  userId: Types.ObjectId;
  group: Types.ObjectId;
  role: "admin" | "member";
}

const usersGroupsSchema = new Schema<IUserGroup>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: "member",
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

export const UserGroupsModel = model<IUserGroup>(
  "UserGroups",
  usersGroupsSchema
);
