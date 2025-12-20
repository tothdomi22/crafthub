import {useMutation, useQueryClient} from "@tanstack/react-query";
import {MessageRequest} from "@/app/types/message";
import {listingKeys} from "@/app/queries/listing.queries";

export default function useCreateFirstMessage(listingId: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: MessageRequest) => {
      const response = await fetch("/api/message/create", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Message creation failed");
      }
      return responseJson;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: listingKeys.detail(listingId),
      });
    },
  });
}
