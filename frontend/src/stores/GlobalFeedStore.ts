import { create } from "zustand";

interface FeedState {
  activeSubTopic: string;
  setActiveSubTopic: (subTopic: string) => void;
}

export const useGlobalFeedStore = create<FeedState>()((set) => {
  return {
    activeSubTopic: "",
    setActiveSubTopic: (subTopic: string) => set({ activeSubTopic: subTopic }),
  };
});
