import {User} from "@/app/types/user";

export interface Profile {
  bio: string | null;
  birthDate: string;
  city: string;
  id: number;
  review: number;
  reviewCount: number;
  user: User;
}
