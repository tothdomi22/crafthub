import {City} from "@/app/types/city";

export interface FilterState {
  mainCategoryId: number | null;
  subCategoryIds: number[];
  minPrice: string;
  maxPrice: string;
  cities: City[];
}
