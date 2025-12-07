import {useMutation} from "@tanstack/react-query";

export default function useDeleteUser() {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/user/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "User deletion failed");
      }
      return responseJson;
    },
  });
}
