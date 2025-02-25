import { create } from "zustand";
import { persist } from "zustand/middleware";

type Group = {
    name: string
    description: string
    subTopic: {
        _id: string,
        slug: string
    }
    groupId: string
}

type GroupStore = {
    currentGroup: Group;
    setCurrentGroup: (group: Group) => void;
    resetCurrentGroup: () => void
}

const defaultGroup: Group = {
    name: "",
    description: "",
    subTopic: {
        _id: "",
        slug: ""
    },
    groupId: ""
}

const useGroupStore = create<GroupStore>()(
    persist((set) => ({
        currentGroup: defaultGroup,
        setCurrentGroup: (group) => set({ currentGroup: group }),
        resetCurrentGroup: () => set({ currentGroup: defaultGroup })
    }), {
        name: "group-storage"
    })
)

export default useGroupStore