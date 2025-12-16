import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Profile, ProfileCreateRequest} from "@/app/types/profile";

export default function useCreateProfile({userId}: {userId: string}) {
  const queryClient = useQueryClient();
  const queryKey = ["conversation" + userId];
  return useMutation({
    mutationFn: async (data: ProfileCreateRequest) => {
      const body = {
        birthDate: data.birthDate,
        cityId: data.city.id,
        bio: data.bio,
      };
      const response = await fetch("/api/profile/create", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.detail || "Profile creation failed");
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
