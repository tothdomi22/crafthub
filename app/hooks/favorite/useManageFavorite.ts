import {useMutation, useQueryClient} from "@tanstack/react-query";
import {listingKeys} from "@/app/queries/listing.queries";
import {favoriteKeys} from "@/app/queries/favorite.queries";

export default function useManageFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      listingId,
      isCurrentlyLiked,
    }: {
      listingId: number;
      isCurrentlyLiked: boolean;
      userId?: string;
    }) => {
      const url = isCurrentlyLiked
        ? `/api/favorite/delete?listingId=${listingId}`
        : `/api/favorite/create?listingId=${listingId}`;
      const method = isCurrentlyLiked ? "DELETE" : "POST";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const responseJson = await response.json();
      if (!response.ok) {
        throw new Error(responseJson.message || "Favorite failed");
      }
      return responseJson;
    },
    onSuccess: async () => {
      // await queryClient.invalidateQueries({queryKey: listingKeys.infinite()});
      // await queryClient.invalidateQueries({
      //   queryKey: listingKeys.detail(variables.listingId),
      // });
      await queryClient.invalidateQueries({queryKey: listingKeys.all});
      await queryClient.invalidateQueries({queryKey: favoriteKeys.all});
    },
  });
}
