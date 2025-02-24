import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { db } from "@/lib/firebase";
import { useChatStore } from "@/stores/ChatStore";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { Icon } from "@iconify/react";
import person from "@img/assets/person.png";
import { useMutation } from "@tanstack/react-query";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { ChevronLeft, Send } from "lucide-react";
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

export function SingleChat() {
  const updateChat = useChatStore((state) => state.setSelectedChat);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const user = useGlobalAuthStore((state) => state.user);

  useEffect(() => {
    if (!selectedChat.userId) return;

    const chatId = [selectedChat.userId, user?.id].sort().join("_");

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
  }, [selectedChat.userId]);

  const { isPending, mutate } = useMutation({
    mutationKey: ["chat", "sendMessage"],

    mutationFn: async (variables: IMessage) => {
      const res = await _axios.post("/chat/sendmessage", variables);
      return res;
    },
  });

  function handleSendMessage() {
    if (message.trim().length === 0)
      return toast.error("Message cannot be empty");

    mutate({
      receiverId: selectedChat.userId,
      text: message,
      senderId: user?.id.toString() || "",
      timestamp: Date.now(),
    });

    setMessage("");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-3">
        <div className="flex gap-2 items-center">
          <ChevronLeft
            className="cursor-pointer"
            onClick={() =>
              updateChat({
                selected: false,
                name: "",
                userId: "",
              })
            }
          />
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
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] w-fit p-2 rounded-2xl text-sm ${
              msg.senderId === user?.id.toString()
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="relative mt-4 p-3 border-t flex items-center gap-2">
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
          className="border-none bg-contrastbg text-xs text-[#828485] placeholder:text-xs font-medium pr-10"
        />

        <Button
          variant={"outline"}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-1 rounded-full text-blue-400 bg-transparent cursor-pointer"
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
