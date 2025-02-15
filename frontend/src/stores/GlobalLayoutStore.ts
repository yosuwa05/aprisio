import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type layout = "post" | "group" | "event";
type tab = "created" | "joined" | "events";

interface LayoutState {
  activeLayout: layout;
  setActiveLayout: (activeLayout: layout) => void;
  activeProfileTab: string;
  setActiveProfileTab: (activeProfileTab: tab) => void;
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
      }),
      {
        name: "layout-storage",
      }
    )
  )
);
