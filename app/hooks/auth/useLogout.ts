import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";

export default function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Logout failed");
      }

      return response.json();
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });
}
