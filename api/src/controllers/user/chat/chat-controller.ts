import { db } from "@/lib/firebase";
import { UserModel } from "@/models";
import { ChatModel } from "@/models/chatmodel";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";

export const chatController = new Elysia({
  prefix: "/chat",
  tags: ["User - Chat"],
})
  .get(
    "/contacts",
    async ({ store }) => {
      try {
        const userId = (store as StoreType)?.id;
        if (!userId) return { error: "Unauthorized" };

        const contacts = await ChatModel.find({
          users: { $in: [userId] },
        })
          .select("lastMessage lastUpdated chatId")
          .lean();

        const withProfile = await Promise.all(
          contacts.map(async (contact: any) => {
            const otherUserId = contact.chatId.split("_")[0];
            const user = await UserModel.findOne({ _id: otherUserId }).select(
              "name email"
            );

            return {
              ...contact,
              profile: user || null,
            };
          })
        );

        return {
          contacts: withProfile,
          status: true,
        };
      } catch (error) {
        console.log("Contacts Fetch Error:", error);
        return { error: "Something went wrong" };
      }
    },
    {
      detail: {
        description: "Get chat contacts",
        summary: "Get only users the current user has chatted with",
      },
    }
  )
  .post(
    "/sendmessage",
    async ({ body, store }) => {
      try {
        const userId = (store as StoreType)?.id;
        if (!userId) return { error: "Unauthorized" };

        const { receiverId, text } = body;

        const chatId = [userId, receiverId].sort().join("_");

        const message = {
          senderId: userId,
          receiverId,
          text,
          timestamp: Date.now(),
        };

        const batch = db.batch();

        const messageRef = db
          .collection("chats")
          .doc(chatId)
          .collection("messages")
          .doc(`${message.timestamp}`);
        batch.set(messageRef, message);

        const chatRef = db.collection("chats").doc(chatId);
        batch.set(
          chatRef,
          {
            lastMessage: text,
            lastUpdated: message.timestamp,
          },
          { merge: true }
        );

        const messageWrite = batch.commit();

        const chatUpdate = ChatModel.findOneAndUpdate(
          { chatId },
          {
            $set: {
              lastMessage: text,
              lastUpdated: message.timestamp,
            },
            $setOnInsert: {
              chatId,
              users: [userId, receiverId],
            },
          },
          { upsert: true, new: true }
        );

        await Promise.all([messageWrite, chatUpdate]);

        return { status: true };
      } catch (error) {
        console.error("SendMessage Error:", error);
        return { error: "Something went wrong" };
      }
    },
    {
      body: t.Object({
        receiverId: t.String(),
        text: t.String(),
      }),
      detail: {
        summary: "Send a message to a chat",
      },
    }
  )
  .get(
    "/messages/:receiverId",
    async ({ params, store }) => {
      try {
        const userId = (store as StoreType)?.id;
        if (!userId) return { error: "Unauthorized" };

        const receiverId = params.receiverId;

        const chatId = [userId, receiverId].sort().join("_");

        const messagesSnapshot = await db
          .collection("chats")
          .doc(chatId)
          .collection("messages")
          .orderBy("timestamp", "asc")
          .get();

        const messages = messagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return { messages, status: true };
      } catch (error) {
        console.error("GetMessages Error:", error);
        return { error: "Something went wrong" };
      }
    },
    {
      detail: {
        description: "Get chat messages",
        summary: "Get chat messages",
      },
    }
  );
