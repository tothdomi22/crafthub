import {queryOptions} from "@tanstack/react-query";
import useListReviewsById from "@/app/hooks/review/useListReviewsById";
import {Review} from "@/app/types/review";

export const reviewKeys = {
  all: ["review"] as const,
  user: (userId: string | number) =>
    [...reviewKeys.all, String(userId)] as const,
};

export const reviewUserQuery = (userId: string | number) =>
  queryOptions<Review[]>({
    queryKey: reviewKeys.user(userId),
    queryFn: () => useListReviewsById(userId),
  });
