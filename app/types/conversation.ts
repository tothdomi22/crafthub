import {User} from "@/app/types/user";
import {ListingReview} from "@/app/types/listing";

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  userOne: User;
  userTwo: User;
  listing: ListingReview;
}
