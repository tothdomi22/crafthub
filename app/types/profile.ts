import {User} from "@/app/types/user";
import {City} from "@/app/types/city";

export interface Profile {
  bio: string | null;
  birthDate: string | null;
  city: City | null;
  id: number;
  review: number;
  reviewCount: number;
  user: User;
}

export interface ProfileUpdateRequest {
  birthDate?: string;
  city?: City;
  bio?: string;
}
export interface ProfileCreateRequest {
  birthDate: string;
  city: City;
  bio: string;
}

export interface ProfileAndUserUpdateProps {
  name: string;
  email: string;
  bio: string;
  city: City | null;
  birthDate: string;
}
