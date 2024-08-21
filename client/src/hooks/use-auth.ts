import { AuthType } from "@/interfaces";
import { create } from "zustand";

type AuthStore = {
  auth: AuthType;
  setAuth: (auth: AuthType) => void;
};

export const useAuth = create<AuthStore>(set => ({
  auth: "login",
  setAuth: auth => set({ auth }),
}));
