import {useMutation} from "@tanstack/react-query";

const useRegister = () => {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
    }) => {
      const response = await fetch("/api/auth/register", {
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
      return responseJson;
    },
  });
};

export default useRegister;
