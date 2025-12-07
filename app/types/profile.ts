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

export interface ProfileUpdateRequest {
  birthDate: string;
  city: string;
  bio: string;
}

export interface ProfileAndUserUpdateProps {
  name: string;
  email: string;
  bio: string;
  city: string;
  birthDate: string;
}
