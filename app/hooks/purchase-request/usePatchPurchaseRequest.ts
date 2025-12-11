import {useMutation, useQueryClient} from "@tanstack/react-query";
import {PurchaseRequestPatchRequest} from "@/app/types/purchaseRequest";
import {Notification, NotificationTypeEnum} from "@/app/types/notification";

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

      const previousData = queryClient.getQueryData<Notification[]>(queryKey);

      // Find the matching notification BEFORE removal
      const deletedNotification = previousData?.find(
        n =>
          n.type === NotificationTypeEnum.PURCHASE_REQUEST &&
          String(n.data.requestId) === purchaseRequestData.purchaseRequestId,
      );

      // Remove it optimistically
      queryClient.setQueryData<Notification[]>(
        queryKey,
        old =>
          old?.filter(
            n =>
              !(
                n.type === NotificationTypeEnum.PURCHASE_REQUEST &&
                String(n.data.requestId) ===
                  purchaseRequestData.purchaseRequestId
              ),
          ) || [],
      );

      return {previousData, deletedNotification};
    },

    // Rollback on error
    onError: (err, newMessage, context) => {
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
          queryKey: ["listing" + listingId],
        });
      }
    },
  });
}
