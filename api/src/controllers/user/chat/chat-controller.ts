import { db } from "@/lib/firebase";
import { UserModel } from "@/models";
import { ChatModel } from "@/models/chatmodel";
import { StoreType } from "@/types";
import { CryptoHasher } from "bun";
import Elysia, { t } from "elysia";

export const chatController = new Elysia({
  prefix: "/chat",
  tags: ["User - Chat"],
})
  .get(
    "/contacts",
    async ({ query, store }) => {
      try {
        const userId = (store as StoreType)["id"];

        const contacts = await UserModel.find({ _id: { $ne: userId } })
          .select("name email")
          .limit(5)
          .lean();

        return {
          contacts,
          status: true,
        };
      } catch (error) {
        console.log(error);
        return {
          error,
        };
      }
    },
    {
      detail: {
        description: "Get chat contacts",
        summary: "Get chat contacts",
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

        const hasher = new CryptoHasher("md5");
        hasher.update([userId, receiverId].sort().join("_"));

        const chatId = hasher.digest("hex");

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
          { _id: chatId },
          {
            $set: {
              lastMessage: text,
              lastUpdated: message.timestamp,
            },
            $setOnInsert: {
              _id: chatId,
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
