import {User} from "@/app/types/user";
import {ListingNoCategoryAndUser, ListingReview} from "@/app/types/listing";
import {Message} from "@/app/types/message";

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  userOne: User;
  userTwo: User;
  listing: ListingReview;
}

export interface SingleConversation {
  id: number;
  messages: Message[];
  listing: ListingNoCategoryAndUser;
  recipient: User;
}
