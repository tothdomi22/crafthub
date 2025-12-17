import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ReviewCreationRequest} from "@/app/types/review";
import {listingKeys} from "@/app/queries/list.queries";
import {reviewKeys} from "@/app/queries/review.queries";

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: listingKeys.all});
      await queryClient.invalidateQueries({queryKey: reviewKeys.all});
    },
  });
}
