import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Profile, ProfileUpdateRequest} from "@/app/types/profile";

export default function useUpdateProfile({userId}: {userId: string}) {
  const queryClient = useQueryClient();
  const queryKey = ["conversation" + userId];
  return useMutation({
    mutationFn: async (data: ProfileUpdateRequest) => {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.detail || "Profile update failed");
      }
      return responseJson;
    },
    onMutate: async data => {
      await queryClient.cancelQueries({queryKey});
      const previousData = queryClient.getQueryData<Profile>(queryKey);
      if (previousData) {
        queryClient.setQueryData<Profile>(queryKey, {
          ...previousData,
          bio: data.bio,
          birthDate: data.birthDate,
          city: data.city,
        });
      }
      return {previousData};
    },
    onError: (err, newMessage, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey});
    },
  });
}
