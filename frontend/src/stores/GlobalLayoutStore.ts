import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type layout = "post" | "group" | "event";
type tab = "created" | "joined" | "events";
type myProfileTab =
  | "commented-posts"
  | "created-posts"
  | "favourite-posts"
  | "organised-events"
  | "participated-events"
  | "created-groups"
  | "joined-groups"
  | "settings"
  | "payment"
  | "edit-profile";

interface LayoutState {
  activeLayout: layout;
  setActiveLayout: (activeLayout: layout) => void;
  activeProfileTab: string;
  setActiveProfileTab: (activeProfileTab: tab) => void;
  activeMyProfileTab: string;
  setActiveMyProfileTab: (activeMyProfileTab: myProfileTab) => void;
}

export const useGlobalLayoutStore = create<LayoutState>()(
  devtools(
    persist(
      (set) => ({
        activeLayout: "post",
        setActiveLayout: (activeLayout: layout) => set({ activeLayout }),
        activeProfileTab: "created",
        setActiveProfileTab: (activeProfileTab: tab) =>
          set({ activeProfileTab }),
        activeMyProfileTab: "commented-posts",
        setActiveMyProfileTab: (activeMyProfileTab: myProfileTab) =>
          set({ activeMyProfileTab }),
      }),
      {
        name: "layout-storage",
      }
    )
  )
);
