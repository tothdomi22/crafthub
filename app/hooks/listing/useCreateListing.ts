import {useMutation} from "@tanstack/react-query";
import ListingRequest from "@/app/types/listing";

export default function useCreateListing() {
  return useMutation({
    mutationFn: async (data: ListingRequest) => {
      const response = await fetch("/api/listing/create", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Listing creation failed");
      }
      return responseJson;
    },
  });
}
