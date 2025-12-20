import {City} from "@/app/types/city";

export interface FilterState {
  mainCategoryIds: number[];
  subCategoryIds: number[];
  minPrice: string;
  maxPrice: string;
  cities: City[];
}
