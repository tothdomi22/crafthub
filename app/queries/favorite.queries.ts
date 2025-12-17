import {queryOptions} from "@tanstack/react-query";
import useListFavorite from "@/app/hooks/favorite/useListFavorite";
import {Favorite} from "@/app/types/favorite";

export const favoriteKeys = {
  all: ["favorite"] as const,
  list: () => [...favoriteKeys.all, "list"] as const,
};

export const favoriteListQuery = () =>
  queryOptions<Favorite[]>({
    queryKey: favoriteKeys.list(),
    queryFn: () => useListFavorite(),
    select: data =>
      [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
  });
