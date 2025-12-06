import {SubCategory} from "@/app/types/admin/category/category";
import {User} from "@/app/types/user";

export interface ListingRequest {
  name: string;
  price: number;
  canShip: boolean;
  city: string;
  description: string;
  subCategoryId: number;
}
export interface ListingUpdateRequest {
  name?: string;
  price?: number;
  canShip?: boolean;
  city?: string;
  description?: string;
  subCategoryId?: number;
  status: ListingStatusEnum;
}

export enum ListingStatusEnum {
  ACTIVE = "ACTIVE",
  FROZEN = "FROZEN",
  ARCHIVED = "ARCHIVED",
}

export interface ListingReview {
  id: number;
  name: string;
}

export interface ListingNoCategoryAndUser extends ListingReview {
  price: number;
  canShip: boolean;
  city: string;
  description: string;
  createdAt: string;
  status: ListingStatusEnum;
}

export interface Listing extends ListingNoCategoryAndUser {
  subCategory: SubCategory;
  user: User;
  conversationId: number | null;
}
