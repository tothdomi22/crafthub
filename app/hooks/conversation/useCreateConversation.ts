import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ConversationRequest} from "@/app/types/conversation";
import {conversationKeys} from "@/app/queries/conversation.queries";

export default function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ConversationRequest) => {
      const response = await fetch("/api/conversation/create", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "Conversation creation failed");
      }
      return responseJson;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: conversationKeys.list()});
    },
  });
}
