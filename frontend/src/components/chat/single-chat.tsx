import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { useChatStore } from "@/stores/ChatStore";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react";
import person from "@img/assets/person.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Send, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface IMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

const fetchFirestore = async () => {
  const { db } = await import("@/lib/firebase");
  return db;
};

export function SingleChat() {
  const updateChat = useChatStore((state) => state.setSelectedChat);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const user = useGlobalAuthStore((state) => state.user);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!selectedChat.userId || !user?.id) return;

    import("firebase/firestore").then(
      ({ collection, onSnapshot, orderBy, query }) => {
        import("@/lib/firebase").then(({ db }) => {
          if (!db) return;

          const chatId = [selectedChat.userId, user.id].sort().join("_");
          const messagesRef = collection(db, "chats", chatId, "messages");
          const q = query(messagesRef, orderBy("timestamp", "asc"));

          const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as IMessage[];
            setMessages(newMessages);
          });

          return () => unsubscribe();
        });
      }
    );
  }, [selectedChat.userId, user?.id]);

  const { isPending, mutate } = useMutation({
    mutationKey: ["chat", "sendMessage"],

    mutationFn: async (variables: IMessage) => {
      const res = await _axios.post("/chat/sendmessage", variables);
      return res;
    },
  });

  const { mutate: deleteMessage } = useMutation({
    mutationKey: ["chat", "softDeleteMessage"],
    mutationFn: async ({
      chatId,
      messageId,
    }: {
      chatId: string;
      messageId: string;
    }) => {
      await _axios.patch(`/chat/deletemessage/${chatId}/${messageId}`);
    },
    onSuccess: (_, { messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, text: "This message was deleted", deleted: true }
            : msg
        )
      );
    },
  });

  function handleDeleteMessage(messageId: string) {
    if (!selectedChat.userId || !user?.id) return;

    const chatId = [selectedChat.userId, user.id].sort().join("_");
    deleteMessage({ chatId, messageId });
  }

  function handleSendMessage() {
    if (!user?.id) return toast.error("User not authenticated");
    if (message.trim().length === 0)
      return toast.error("Message cannot be empty");

    const newMessage: IMessage = {
      id: Date.now().toString(),
      receiverId: selectedChat.userId,
      text: message,
      senderId: user.id.toString(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);

    mutate(newMessage, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["chat-messages", selectedChat.userId],
        });
      },
      onError: () => {
        setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
        toast.error("Message failed to send");
      },
    });

    setMessage("");
  }

  function goBack() {
    updateChat({
      selected: false,
      name: "",
      userId: "",
    });
    queryClient.invalidateQueries({
      queryKey: ["chat-contacts"],
    });
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-3 border-b bg-white sticky top-[-20px] z-10">
        <div className="flex gap-2 items-center">
          <ChevronLeft className="cursor-pointer" onClick={goBack} />
          <div className="flex gap-2 items-center">
            <Image
              src={person}
              alt="person"
              width={30}
              height={30}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <h5 className="text-textcol text-sm font-normal m-0 p-0">
                {selectedChat.name}
              </h5>
            </div>
          </div>
        </div>
        <Icon icon={"bi:three-dots"} className="text-xl cursor-pointer" />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg: any) => (
          <div key={msg.id} className="flex items-center">
            <div
              className={`max-w-[70%] w-fit p-2 rounded-2xl text-sm break-words ${
                msg.senderId === user?.id.toString()
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              {msg.deleted ? (
                <span className="italic text-gray-400">
                  This message was deleted
                </span>
              ) : (
                msg.text
              )}
            </div>

            {msg.senderId === user?.id.toString() && !msg.deleted && (
              <Trash2
                className="ml-2 cursor-pointer text-red-500"
                size={16}
                onClick={() => handleDeleteMessage(msg.id!)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="p-3 border-t flex items-center gap-2 bg-white sticky bottom-[-20px]">
        <Input
          placeholder="Type a message..."
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (isPending) return;
              handleSendMessage();
            }
          }}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border-none bg-contrastbg text-xs text-[#828485] placeholder:text-xs font-medium pr-10"
        />

        <Button
          variant={"outline"}
          className="p-1 rounded-full text-blue-400 bg-transparent cursor-pointer"
          asChild
          onClick={() => {
            if (isPending) return;
            handleSendMessage();
          }}
        >
          <Send className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}
