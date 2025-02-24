import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { useChatStore } from "@/stores/ChatStore";
import { Icon } from "@iconify/react";
import person from "@img/assets/person.png";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, Send } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface IMEssage {
  receiverId: string;
  text: string;
}

export function SingleChat() {
  const updateChat = useChatStore((state) => state.setSelectedChat);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hey there!", sender: "other" },
    { text: "Hello! How are you?", sender: "me" },
  ]);

  const { isPending, mutate } = useMutation({
    mutationKey: ["chat", "sendMessage"],
    mutationFn: async (variables: IMEssage) => {
      const res = await _axios.post("/chat/sendmessage", variables);
      return res;
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  function handleSendMessage() {
    if (message.trim().length === 0)
      return toast.error("Message cannot be empty");

    mutate({
      receiverId: selectedChat.userId,
      text: message,
    });

    setMessage("");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center">
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
              msg.sender === "me"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="relative mt-4">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border-none bg-contrastbg text-xs text-[#828485] placeholder:text-xs font-medium pr-10"
        />

        <Button
          variant={"outline"}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full   text-blue-400 bg-transparent cursor-pointer"
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
