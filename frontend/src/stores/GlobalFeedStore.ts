import { create } from "zustand";

interface FeedState {
  activeSubTopic: string;
  setActiveSubTopic: (subTopic: string) => void;
  activeGroup: string;
  setActiveGroup: (group: string) => void;
  activeGroupId: string;
  setActiveGroupId: (group: string) => void;
}

export const useGlobalFeedStore = create<FeedState>()((set) => {
  return {
    activeSubTopic: "",
    setActiveSubTopic: (subTopic: string) => set({ activeSubTopic: subTopic }),
    activeGroup: "",
    setActiveGroup: (group: string) => set({ activeGroup: group }),
    activeGroupId: "",
    setActiveGroupId: (groupId: string) => set({ activeGroupId: groupId })
  };
});
