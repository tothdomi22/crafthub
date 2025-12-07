import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UserUpdateRequest} from "@/app/types/user";

export default function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async ({data, id}: {data: UserUpdateRequest; id: string}) => {
      const response = await fetch(`/api/user/update`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || "User update failed");
      }
      return responseJson;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["profile" + variables.id],
      });
    },
  });
}
