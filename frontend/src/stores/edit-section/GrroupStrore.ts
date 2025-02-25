import { create } from "zustand";
import { persist } from "zustand/middleware";

type Group = {
    name: string
    description: string
}