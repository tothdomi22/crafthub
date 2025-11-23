"use client";

import React from "react";
import {useQuery} from "@tanstack/react-query";
import useListMainCategory from "@/app/hooks/admin/main-category/useListMainCategory";

export default function AdminPage() {
  const {data: mainCategoriesData} = useQuery({
    queryFn: useListMainCategory,
    queryKey: ["mainCategories"],
  });
  console.log(mainCategoriesData);
  return (
    <div>
      <p>main categories</p>
    </div>
  );
}
