import {ListingPagination} from "@/app/types/listing";

export async function useListListings({
  pageParam = 0,
  categoryId,
}: {
  pageParam?: number;
  categoryId?: number | null;
}): Promise<ListingPagination> {
  let url = `/api/listing/list?page=${pageParam}`;

  if (categoryId) {
    url += `&categoryId=${categoryId}`;
  }

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return (await response.json()) as Promise<ListingPagination>;
}
