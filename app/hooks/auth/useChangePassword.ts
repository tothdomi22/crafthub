import {useMutation} from "@tanstack/react-query";
import {ChangePasswordRequest} from "@/app/types/user";

export default function useChangePassword() {
  return useMutation({
    mutationFn: async ({data}: {data: ChangePasswordRequest}) => {
      const response = await fetch(`/api/auth/change-password`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Password change failed");
      }
      return responseJson;
    },
  });
}
