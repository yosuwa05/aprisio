import { slugify } from "@/lib/utils";
import { model, Schema, Types } from "mongoose";

interface ISubTopic {
  subTopicName: string;
  topic: Types.ObjectId;
  description: string;
  isDeleted: boolean;
  active: boolean;
  slug: string;
  members: number;
  image: string;
}

const subtopicSchema = new Schema<ISubTopic>(
  {
    subTopicName: {
      type: String,
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      index: true,
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
    image: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

subtopicSchema.index({ slug: 1 });

subtopicSchema.pre("save", async function (next) {
  if (!this.isModified("slug")) {
    return next();
  }

  const existing = await SubTopicModel.findOne({ slug: this.slug });

  if (existing) {
    this.slug = slugify(this.subTopicName);
  }

  next();
});

export const SubTopicModel = model<ISubTopic>("subtopic", subtopicSchema);
