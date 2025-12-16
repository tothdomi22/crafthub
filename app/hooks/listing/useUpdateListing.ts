import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ListingUpdateRequest} from "@/app/types/listing";

export default function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      id,
    }: {
      data: ListingUpdateRequest;
      id: string;
    }) => {
      const {city, ...rest} = data;
      const body = {cityId: city ? city.id : null, ...rest};
      const response = await fetch(`/api/listing/update?id=${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Listing update failed");
      }
      return responseJson;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({queryKey: ["listings"]});
      await queryClient.invalidateQueries({queryKey: ["my-listings"]});
      await queryClient.invalidateQueries({
        queryKey: ["listing" + variables.id],
      });
    },
  });
}
