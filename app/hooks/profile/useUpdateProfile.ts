import {useMutation} from "@tanstack/react-query";
import {ProfileCreationRequest} from "@/app/types/profile";

export default function useUpdateProfile() {
  return useMutation({
    mutationFn: async (data: ProfileCreationRequest) => {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.detail || "Profile update failed");
      }
      return responseJson;
    },
  });
}
