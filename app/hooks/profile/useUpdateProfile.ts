import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Profile, ProfileUpdateRequest} from "@/app/types/profile";
import {profileKeys} from "@/app/queries/profile.queries";

export default function useUpdateProfile({userId}: {userId: string}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProfileUpdateRequest) => {
      const {city, ...rest} = data;
      const body = {...rest, cityId: city?.id};
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        body: JSON.stringify(body),
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
      await queryClient.cancelQueries({queryKey: profileKeys.user(userId)});
      const previousData = queryClient.getQueryData<Profile>(
        profileKeys.user(userId),
      );
      if (previousData) {
        queryClient.setQueryData<Profile>(profileKeys.user(userId), {
          ...previousData,
          bio: data.bio ?? previousData.bio,
          birthDate: data.birthDate ?? previousData.birthDate,
          city: data.city ?? previousData.city,
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
