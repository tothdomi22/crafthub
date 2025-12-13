import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ReviewCreationRequest} from "@/app/types/review";

export default function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      purchaseRequestId,
    }: {
      data: ReviewCreationRequest;
      purchaseRequestId: string;
    }) => {
      const response = await fetch(
        `/api/review/create?purchaseRequestId=${purchaseRequestId}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Review creation failed");
      }
      return responseJson;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({queryKey: ["listings"]});
      await queryClient.invalidateQueries({queryKey: ["my-listings"]});
      await queryClient.invalidateQueries({
        queryKey: ["listing" + variables.purchaseRequestId],
      });
    },
  });
}
