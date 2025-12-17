import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Profile, ProfileCreateRequest} from "@/app/types/profile";
import {profileKeys} from "@/app/queries/profile.queries";

export default function useCreateProfile({userId}: {userId: string}) {
  const queryClient = useQueryClient();
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
      await queryClient.cancelQueries({queryKey: profileKeys.all});
      const previousData = queryClient.getQueryData<Profile>(
        profileKeys.user(userId),
      );
      if (previousData) {
        queryClient.setQueryData<Profile>(profileKeys.user(userId), {
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
        queryClient.setQueryData(
          profileKeys.user(userId),
          context.previousData,
        );
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: profileKeys.user(userId)});
    },
  });
}
