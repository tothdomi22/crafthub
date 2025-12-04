import {User} from "@/app/types/user";

export interface Message {
  createdAt: string;
  id: number;
  textContent: string;
  sender: User;
}
