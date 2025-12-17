import {queryOptions} from "@tanstack/react-query";
import useListConversation from "@/app/hooks/conversation/useListConversation";
import {
  ConvoWithLastMessageAndUnreadList,
  SingleConversation,
} from "@/app/types/conversation";
import getConversation from "@/app/hooks/conversation/useGetConversation";

export const conversationKeys = {
  all: ["conversation"] as const,
  list: () => [...conversationKeys.all, "list"] as const,
  details: () => [...conversationKeys.all, "detail"] as const,
  detail: (conversationId: string | number) =>
    [...conversationKeys.details(), conversationId] as const,
};

export const conversationListQuery = () =>
  queryOptions<ConvoWithLastMessageAndUnreadList>({
    queryKey: conversationKeys.list(),
    queryFn: () => useListConversation(),
  });

export const conversationDetailQuery = (conversationId: string | number) =>
  queryOptions<SingleConversation>({
    queryKey: conversationKeys.detail(conversationId),
    queryFn: () => getConversation(conversationId),
  });
