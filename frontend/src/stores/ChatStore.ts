import { create } from "zustand";

type Chat = {
  userId: string;
  name: string;
  selected: boolean;
};

interface ChatStore {
  selectedChat: Chat;
  setSelectedChat: (selectedChat: Chat) => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  selectedChat: { userId: "", name: "", selected: false },
  setSelectedChat: (selectedChat: Chat) =>
    set({
      selectedChat: {
        userId: selectedChat.userId,
        name: selectedChat.name,
        selected: selectedChat.selected,
      },
    }),
}));
