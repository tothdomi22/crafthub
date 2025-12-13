import {Listing} from "@/app/types/listing";

export interface Favorite {
  id: number;
  createdAt: string;
  listing: Listing;
}
