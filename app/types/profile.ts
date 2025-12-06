import {User} from "@/app/types/user";

export interface Profile {
  bio: string | null;
  birthDate: string | null;
  city: string | null;
  id: number;
  review: number;
  reviewCount: number;
  user: User;
}
