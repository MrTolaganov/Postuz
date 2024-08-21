import { IPost } from "@/interfaces";
import { create } from "zustand";

type PostStore = {
  posts: IPost[];
  setPosts: (posts: IPost[]) => void;
};

export const postStore = create<PostStore>(set => ({
  posts: [],
  setPosts: posts => set({ posts }),
}));
