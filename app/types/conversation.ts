import {User} from "@/app/types/user";

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  userOne: User;
  userTwo: User;
}
