import {ListingPagination} from "@/app/types/listing";

export async function useSearchListings({
  pageParam = 0,
  query,
}: {
  pageParam?: number;
  query: string;
}): Promise<ListingPagination> {
  const url = `/api/search/listing?query=${query}&page=${pageParam}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return (await response.json()) as Promise<ListingPagination>;
}
