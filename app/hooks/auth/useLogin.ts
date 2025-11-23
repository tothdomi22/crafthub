import {useMutation} from "@tanstack/react-query";

const useLogin = () => {
  return useMutation({
    mutationFn: async (data: {email: string; password: string}) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.detail || "Login failed");
      }

      return data;
    },
  });
};

export default useLogin;
