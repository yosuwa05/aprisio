"use client";

import { _axios } from "@/lib/axios-instance";
import { useChatStore } from "@/stores/ChatStore";
import { useQuery } from "@tanstack/react-query";
import { Contact, MessageCard } from "./message-card";
import { SingleChat } from "./single-chat";

export function ChatContact() {
  const selectedChat = useChatStore((state) => state.selectedChat);

  const { data, isLoading } = useQuery({
    queryKey: ["chat-contacts"],
    queryFn: async () => {
      let res = await _axios.get("/chat/contacts");
      return res.data;
    },
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className=" bg-white flex flex-col gap-2 h-fit flex-1">
      {selectedChat.selected ? (
        <SingleChat />
      ) : (
        data?.contacts?.map((contact: Contact, index: number) => (
          <MessageCard key={index} contact={contact} />
        ))
      )}
    </div>
  );
}
