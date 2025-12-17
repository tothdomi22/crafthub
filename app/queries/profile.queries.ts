import {queryOptions} from "@tanstack/react-query";
import useGetProfile from "@/app/hooks/profile/useGetProfile";
import {Profile} from "@/app/types/profile";

export const profileKeys = {
  all: ["profile"] as const,
  user: (userId: string | number) =>
    [...profileKeys.all, String(userId)] as const,
};

export const profileUserQuery = (userId: string | number | undefined) =>
  queryOptions<Profile>({
    queryKey: profileKeys.user(userId!),
    queryFn: () => useGetProfile(userId!),
    enabled: !!userId,
  });
