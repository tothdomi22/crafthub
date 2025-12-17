import {infiniteQueryOptions, queryOptions} from "@tanstack/react-query";
import useGetListing from "@/app/hooks/listing/useGetListing";
import {Listing, ListingPagination} from "@/app/types/listing";
import useListMyListings from "@/app/hooks/listing/useListMyListings";
import {useListListings} from "@/app/hooks/listing/useListListing";
import useListListingById from "@/app/hooks/listing/useListListingById";

export const listingKeys = {
  all: ["listing"] as const,
  myLists: () => [...listingKeys.all, "my"] as const,
  details: () => [...listingKeys.all, "detail"] as const,
  detail: (id: number | string) => [...listingKeys.details(), id] as const,
  infinite: () => [...listingKeys.all, "infinite"] as const,
  infiniteUser: (userId: number | string) =>
    [...listingKeys.infinite(), userId] as const,
};

export const listingDetailQuery = (id?: number | string) =>
  queryOptions<Listing>({
    queryKey: listingKeys.detail(id!),
    queryFn: () => useGetListing(id!),
    enabled: !!id,
  });

export const listingMyListingsQuery = () =>
  queryOptions<Listing[]>({
    queryKey: listingKeys.myLists(),
    queryFn: () => useListMyListings(),
    select: data =>
      [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
  });

export const listingInfiniteQuery = () =>
  infiniteQueryOptions<ListingPagination, Error>({
    queryKey: listingKeys.infinite(),
    queryFn: ({pageParam}) => useListListings({pageParam: pageParam as number}),
    initialPageParam: 0,
    getNextPageParam: lastPage =>
      lastPage.last ? undefined : lastPage.number + 1,
  });

export const listingInfiniteUserQuery = (
  userId: string | number,
  activeTab: string,
) =>
  infiniteQueryOptions<ListingPagination, Error>({
    queryKey: listingKeys.infiniteUser(userId),
    queryFn: ({pageParam}) => useListListingById(userId, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: lastPage =>
      lastPage.last ? undefined : lastPage.number + 1,
    enabled: activeTab === "shop",
  });
