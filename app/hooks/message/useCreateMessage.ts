import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Message, MessageRequest} from "@/app/types/message";
import {SingleConversation} from "@/app/types/conversation";
import {conversationKeys} from "@/app/queries/conversation.queries";

export default function useCreateMessage(
  conversationId: string,
  userId: string,
) {
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

    // Optimistic update
    onMutate: async newMessageData => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({queryKey: conversationKeys.all});

      // Snapshot previous value
      const previousData = queryClient.getQueryData<SingleConversation>(
        conversationKeys.detail(conversationId),
      );

      // Optimistically update cache
      if (previousData) {
        const optimisticMessage: Message = {
          id: Date.now(), // Temporary ID
          textContent: newMessageData.textContent,
          createdAt: new Date().toISOString(),
          sender: {
            id: Number(userId),
            role: previousData.messages[0]?.sender.role || "USER",
            name: previousData.messages[0]?.sender.name || "You",
            email: previousData.messages[0]?.sender.email || "",
            createdAt: Date.now().toLocaleString(),
          },
        };

        queryClient.setQueryData<SingleConversation>(
          conversationKeys.detail(conversationId),
          {
            ...previousData,
            messages: [...previousData.messages, optimisticMessage],
          },
        );
      }

      // Return context for rollback
      return {previousData};
    },

    // Rollback on error
    onError: (err, newMessage, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          conversationKeys.detail(conversationId),
          context.previousData,
        );
      }
    },

    // Refetch on success to get real data from server
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(conversationId),
      });
    },
  });
}
