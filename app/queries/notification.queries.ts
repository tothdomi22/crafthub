import {queryOptions} from "@tanstack/react-query";
import useListUnread from "@/app/hooks/notification/useListUnread";
import {NotificationWithUnreadMessage} from "@/app/types/notification";

export const notificationKeys = {
  all: ["notification"] as const,
};

export const notificationListQuery = () =>
  queryOptions<NotificationWithUnreadMessage>({
    queryKey: notificationKeys.all,
    queryFn: () => useListUnread(),
  });
