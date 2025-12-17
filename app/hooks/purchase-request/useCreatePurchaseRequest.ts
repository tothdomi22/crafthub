import {useMutation, useQueryClient} from "@tanstack/react-query";
import {listingKeys} from "@/app/queries/list.queries";

export default function useCreatePurchaseRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: string) => {
      const response = await fetch(
        `/api/purchase-request/create?listingId=${listingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(
          responseJson.message || "Purchase request creation failed",
        );
      }
      return responseJson;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: listingKeys.detail(variables),
      });
    },
  });
}
