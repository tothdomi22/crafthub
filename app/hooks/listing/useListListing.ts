import {
  ListingInfiniteQueryParams,
  ListingPagination,
} from "@/app/types/listing";

export async function useListListings({
  pageParam = 0,
  filters,
}: {
  pageParam?: number;
  filters: ListingInfiniteQueryParams;
}): Promise<ListingPagination> {
  const params = new URLSearchParams();
  params.set("page", pageParam.toString());
  if (filters?.query) {
    params.set("query", filters.query);
  }

  if (filters?.minPrice !== undefined) {
    params.set("minPrice", filters.minPrice.toString());
  }

  if (filters?.maxPrice !== undefined) {
    params.set("maxPrice", filters.maxPrice.toString());
  }
  if (filters?.mainCategoryId) {
    params.set("mainCategoryId", filters.mainCategoryId.toString());
  }

  filters?.subCategoryIds?.forEach(id =>
    params.append("subCategoryIds", id.toString()),
  );

  filters?.cityIds?.forEach(id => params.append("cityIds", id.toString()));
  const url = `/api/listing/list?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return (await response.json()) as Promise<ListingPagination>;
}
