import { IUser } from "@/interfaces";
import { create } from "zustand";

type AuthStore = {
  isLoading: boolean;
  isAuth: boolean;
  user: IUser;
  setIsLoading: (isLoading: boolean) => void;
  setIsAuth: (isAuth: boolean) => void;
  setUser: (user: IUser) => void;
};

export const authStore = create<AuthStore>(set => ({
  isLoading: false,
  isAuth: false,
  user: {} as IUser,
  setIsLoading: isLoading => set({ isLoading }),
  setIsAuth: isAuth => set({ isAuth }),
  setUser: user => set({ user }),
}));
