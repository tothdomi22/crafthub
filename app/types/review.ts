import {Listing} from "@/app/types/listing";
import {User} from "@/app/types/user";

export interface Review {
  id: number;
  reviewText: string;
  stars: number;
  createdAt: string;
  listing: Listing;
  reviewerUser: User;
}
