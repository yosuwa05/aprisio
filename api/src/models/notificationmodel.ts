import { Schema, Types, model } from "mongoose";

interface INotification {
  from: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  content: string;
  type: string;
  createdAt: Date;
  readAt: Date;
  post: Types.ObjectId;
  event: Types.ObjectId;
}

const NotificationSchema = new Schema<INotification>({
  from: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  title: { type: String },
  content: { type: String },
  type: { type: String },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date, default: null },
  post: { type: Schema.Types.ObjectId, ref: "Post", default: null },
  event: { type: Schema.Types.ObjectId, ref: "Event", default: null }
});

export const NotificationModel = model<INotification>(
  "Notification",
  NotificationSchema,
);
