import {SubCategory} from "@/app/types/admin/category/category";

export interface ListingRequest {
  name: string;
  price: number;
  canShip: boolean;
  city: string;
  description: string;
  subCategoryId: number;
}

export enum ListingStatusEnum {
  ACTIVE = "ACTIVE",
  FROZEN = "FROZEN",
  ARCHIVED = "ARCHIVED",
}

export interface Listing {
  id: number;
  name: string;
  price: number;
  canShip: boolean;
  city: string;
  description: string;
  createdAt: string;
  status: ListingStatusEnum;
  subCategory: SubCategory;
}
