import { slugify } from "@/lib/utils";
import { model, Schema, Types } from "mongoose";

interface IGroup {
  name: string;
  description: string;
  events: Types.ObjectId[];
  images: [];
  memberCount: number;
  subTopic: Types.ObjectId;
  groupAdmin: Types.ObjectId;
  slug: string;
}

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    images: [],
    memberCount: {
      type: Number,
      default: 0,
    },
    subTopic: {
      type: Schema.Types.ObjectId,
      ref: "subtopic",
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    slug: { type: String },
  },
  {
    timestamps: true,
  }
);

GroupSchema.index({ slug: 1 });

GroupSchema.pre("save", async function (next) {
  if (!this.isModified("slug")) {
    return next();
  }

  const existing = await GroupModel.findOne({ slug: this.slug });

  if (existing) {
    this.slug = slugify(this.name);
  }

  next();
});

export const GroupModel = model<IGroup>("Group", GroupSchema);
