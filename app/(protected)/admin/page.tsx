"use client";

import React from "react";
import {useQuery} from "@tanstack/react-query";
import useListMainCategory from "@/app/hooks/admin/main-category/useListMainCategory";
import {MainCategory, SubCategory} from "@/app/types/admin/category/category";
import useListSubCategory from "@/app/hooks/admin/sub-category/useListSubCategory";

export default function AdminPage() {
  const {data: mainCategoriesData} = useQuery<MainCategory[]>({
    queryFn: useListMainCategory,
    queryKey: ["mainCategories"],
  });
  const {data: subCategoriesData} = useQuery<SubCategory[]>({
    queryFn: useListSubCategory,
    queryKey: ["subCategories"],
  });
  return (
    <div className="flex gap-10">
      <div>
        <h1 className="font-bold text-xl">main categories</h1>
        {/*<select>*/}
        {/*  {mainCategoriesData &&*/}
        {/*    mainCategoriesData.map(mainCategory => (*/}
        {/*      <option key={mainCategory.id} value={mainCategory.id}>*/}
        {/*        {mainCategory.displayName}*/}
        {/*      </option>*/}
        {/*    ))}*/}
        {/*</select>*/}
        <ul>
          {mainCategoriesData &&
            mainCategoriesData.map(mainCategory => (
              <li key={mainCategory.id}>{mainCategory.displayName}</li>
            ))}
        </ul>
      </div>
      <div>
        <h1 className="font-bold text-xl">sub categories</h1>
        {/*<select>*/}
        {/*  {subCategoriesData &&*/}
        {/*    subCategoriesData.map(subCategory => (*/}
        {/*      <option key={subCategory.id} value={subCategory.id}>*/}
        {/*        {subCategory.displayName}*/}
        {/*      </option>*/}
        {/*    ))}*/}
        {/*</select>*/}
        <ul>
          {subCategoriesData &&
            subCategoriesData.map(subCategory => (
              <li key={subCategory.id}>{subCategory.displayName}</li>
            ))}
        </ul>
      </div>
    </div>
  );
}
