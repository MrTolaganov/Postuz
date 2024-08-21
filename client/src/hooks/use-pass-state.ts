import { create } from "zustand";

type PassStateStore = {
  passState: "show" | "hide";
  setPassState: (passState: "show" | "hide") => void;
};

export const usePassState = create<PassStateStore>(set => ({
  passState: "hide",
  setPassState: passState => set({ passState }),
}));
