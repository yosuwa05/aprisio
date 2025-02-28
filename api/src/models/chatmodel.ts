import { Schema, model } from "mongoose";

interface IChat {
  users: string[];
  lastMessage: string;
  lastUpdated: number;
  chatId: string;
}

const ChatSchema = new Schema<IChat>(
  {
    users: { type: [String], required: true, index: true },
    lastMessage: { type: String, default: "" },
    lastUpdated: { type: Number, default: Date.now },
    chatId: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

export const ChatModel = model<IChat>("chats", ChatSchema);
