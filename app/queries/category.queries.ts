import {queryOptions} from "@tanstack/react-query";
import useListSubCategory from "@/app/hooks/sub-category/useListSubCategory";
import {MainCategory, SubCategory} from "@/app/types/admin/category/category";
import useListMainCategory from "@/app/hooks/main-category/useListMainCategory";

export const categoryKeys = {
  all: ["category"] as const,
  allSubCategory: () => [...categoryKeys.all, "subCategory"] as const,
  allMainCategory: () => [...categoryKeys.all, "mainCategory"] as const,
};

export const subCategoryListQuery = () =>
  queryOptions<SubCategory[]>({
    queryKey: categoryKeys.allSubCategory(),
    queryFn: useListSubCategory,
  });
export const mainCategoryListQuery = () =>
  queryOptions<MainCategory[]>({
    queryKey: categoryKeys.allMainCategory(),
    queryFn: useListMainCategory,
  });
