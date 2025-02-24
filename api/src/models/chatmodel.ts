import { Schema, model } from "mongoose";

interface IChat {
  users: string[];
  lastMessage: string;
  lastUpdated: number;
}

const ChatSchema = new Schema<IChat>({
  users: { type: [String], required: true, index: true },
  lastMessage: { type: String, default: "" },
  lastUpdated: { type: Number, default: Date.now },
});

export const ChatModel = model<IChat>("chats", ChatSchema);
