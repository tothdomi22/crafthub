import {useMutation, useQueryClient} from "@tanstack/react-query";

export default function useManageFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      listingId,
      isCurrentlyLiked,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      userId,
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
    onSuccess: async (_data, variables) => {
      // FIXME: this make is refetch every listing, thats 3 fetches per page. fix with optimistic update and dont refetch
      await queryClient.invalidateQueries({queryKey: ["listings"]});
      await queryClient.invalidateQueries({queryKey: ["listings-infinite"]});
      await queryClient.invalidateQueries({queryKey: ["my-listings"]});
      await queryClient.invalidateQueries({queryKey: ["favorites"]});
      await queryClient.invalidateQueries({
        queryKey: ["listing" + variables.listingId],
      });
      if (variables.userId) {
        await queryClient.invalidateQueries({
          queryKey: ["listings" + variables.userId],
        });
      }
    },
  });
}
