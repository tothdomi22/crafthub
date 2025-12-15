import {useMutation, useQueryClient} from "@tanstack/react-query";
import {PurchaseRequestPatchRequest} from "@/app/types/purchaseRequest";
import {
  NotificationTypeEnum,
  NotificationWithUnreadMessage,
} from "@/app/types/notification";

export default function usePatchPurchaseRequest() {
  const queryClient = useQueryClient();
  const queryKey = ["unread-notification"];
  return useMutation({
    mutationFn: async ({
      purchaseRequestId,
      data,
    }: {
      purchaseRequestId: string;
      data: PurchaseRequestPatchRequest;
    }) => {
      const response = await fetch(
        `/api/purchase-request/patch?purchaseRequestId=${purchaseRequestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        },
      );

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(
          responseJson.message || "Purchase request patch failed",
        );
      }
      return responseJson;
    },
    // Optimistic update
    onMutate: async purchaseRequestData => {
      await queryClient.cancelQueries({queryKey});

      const previousData =
        queryClient.getQueryData<NotificationWithUnreadMessage>(queryKey);

      if (!previousData) {
        return {previousData: undefined, deletedNotification: undefined};
      }

      const deletedNotification = previousData.notifications.find(
        n =>
          n.type === NotificationTypeEnum.PURCHASE_REQUEST &&
          String(n.data.requestId) === purchaseRequestData.purchaseRequestId,
      );

      queryClient.setQueryData<NotificationWithUnreadMessage>(queryKey, old => {
        if (!old) return old;

        const updatedNotifications = old.notifications.filter(
          n =>
            !(
              n.type === NotificationTypeEnum.PURCHASE_REQUEST &&
              String(n.data.requestId) === purchaseRequestData.purchaseRequestId
            ),
        );

        return {
          ...old,
          notifications: updatedNotifications,
          unreadMessage: updatedNotifications.some(n => !n.isRead),
        };
      });

      return {previousData, deletedNotification};
    },

    // Rollback on error
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    // Refetch on success to get real data from server
    onSuccess: async (_data, _variables, context) => {
      await queryClient.invalidateQueries({queryKey});

      if (
        context?.deletedNotification &&
        context.deletedNotification.type ===
          NotificationTypeEnum.PURCHASE_REQUEST
      ) {
        const listingId = context.deletedNotification.data.listingId;

        await queryClient.invalidateQueries({
          queryKey: ["listing", listingId],
        });
      }
    },
  });
}
