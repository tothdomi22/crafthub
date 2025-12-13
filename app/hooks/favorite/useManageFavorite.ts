import {useMutation, useQueryClient} from "@tanstack/react-query";

export default function useManageFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      listingId,
      isCurrentlyLiked,
    }: {
      listingId: number;
      isCurrentlyLiked: boolean;
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
      await queryClient.invalidateQueries({queryKey: ["listings"]});
      await queryClient.invalidateQueries({queryKey: ["my-listings"]});
      await queryClient.invalidateQueries({
        queryKey: ["listing" + variables.listingId],
      });
    },
  });
}
