import {SubCategory} from "@/app/types/admin/category/category";
import {User} from "@/app/types/user";
import {City} from "@/app/types/city";

export interface ListingRequest {
  name: string;
  price: number;
  canShip: boolean;
  city: City;
  description: string;
  subCategoryId: number;
}
export interface ListingUpdateRequest {
  name?: string;
  price?: number;
  canShip?: boolean;
  city?: City;
  description?: string;
  subCategoryId?: number;
  status?: ListingStatusEnum;
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
  city: City;
  description: string;
  createdAt: string;
  status: ListingStatusEnum;
}

export interface Listing extends ListingNoCategoryAndUser {
  subCategory: SubCategory;
  user: User;
  conversationId: number | null;
  pendingRequestExists: boolean;
  isLiked: boolean;
}

export interface ListingPagination {
  content: Listing[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface ListingInfiniteQueryParams {
  query?: string;
  mainCategoryId?: number;
  subCategoryIds?: number[];
  cityIds?: number[];
  minPrice?: number;
  maxPrice?: number;
}
