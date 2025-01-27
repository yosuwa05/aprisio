import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IUser {
  name: string;
  email: string;
  id: string;
}

interface BearState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const useGlobalAuthStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user: IUser | null) => set({ user }),
      }),
      {
        name: "user-storage",
      }
    )
  )
);
