import { create } from "zustand";

interface FeedState {
  activeSubTopicName: string;
  setActiveSubTopicName: (subTopicName: string) => void;
  activeSubTopic: string;
  setActiveSubTopic: (subTopic: string) => void;
  activeGroup: string;
  setActiveGroup: (group: string) => void;
  activeGroupId: string;
  setActiveGroupId: (group: string) => void;
}

export const useGlobalFeedStore = create<FeedState>()((set) => {
  return {
    activeSubTopicName: "",
    setActiveSubTopicName: (subTopicName: string) => set({ activeSubTopicName: subTopicName }),
    activeSubTopic: "",
    setActiveSubTopic: (subTopic: string) => set({ activeSubTopic: subTopic }),
    activeGroup: "",
    setActiveGroup: (group: string) => set({ activeGroup: group }),
    activeGroupId: "",
    setActiveGroupId: (groupId: string) => set({ activeGroupId: groupId })
  };
});
