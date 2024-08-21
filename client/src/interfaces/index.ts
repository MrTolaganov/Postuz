export interface IPost {
  id: string;
  title: string;
  body: string;
  image: string;
  author: string;
}

export interface IUser {
  id: string;
  email: string;
  isActivated: boolean;
}

export type AuthType = "login" | "register" | "forgot-pass";
