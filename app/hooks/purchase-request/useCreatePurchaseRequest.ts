import {useMutation} from "@tanstack/react-query";

export default function useCreatePurchaseRequest() {
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
  });
}
