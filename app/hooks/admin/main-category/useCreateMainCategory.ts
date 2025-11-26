import {useMutation} from "@tanstack/react-query";

export default function useCreateMainCategory() {
  return useMutation({
    mutationFn: async (data: {
      uniqueName: string;
      displayName: string;
      description: string;
    }) => {
      const response = await fetch("/api/admin/main-category/create", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.detail || "Main category creation failed");
      }

      return data;
    },
  });
}
