import { Schema, Types, model } from "mongoose";

type IGroupPhoto = {
  group: Types.ObjectId;
  photo: string;
};

const GroupPhotoSchema = new Schema<IGroupPhoto>(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    photo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const GroupPhotoModel = model<IGroupPhoto>(
  "GroupPhoto",
  GroupPhotoSchema
);
