import {useMutation} from "@tanstack/react-query";
import {MessageRequest} from "@/app/types/message";

export default function useCreateFirstMessage() {
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
  });
}
