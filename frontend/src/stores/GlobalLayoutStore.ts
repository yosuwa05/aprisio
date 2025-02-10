import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type layout = "post" | "group" | "event";

interface LayoutState {
  activeLayout: layout;
  setActiveLayout: (activeLayout: layout) => void;
}

export const useGlobalLayoutStore = create<LayoutState>()(
  devtools(
    persist(
      (set) => ({
        activeLayout: "post",
        setActiveLayout: (activeLayout: layout) => set({ activeLayout }),
      }),
      {
        name: "layout-storage",
      }
    )
  )
);
