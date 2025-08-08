import { login, LoginPayload, LoginResponse, register, RegisterPayload } from "@/src/services/auth";
import { useAuthStore } from "@/src/stores";
import useUserStore from "@/src/stores/userStore";
import { useMutation } from "@tanstack/react-query";

export function useLoginMutation() {
  const setToken = useUserStore((s) => s.setToken);
  const setLoggedIn = useAuthStore((s) => s.setLoggedIn);
  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data: LoginResponse) => {
      setToken(data.access_token);
      setLoggedIn(true);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: (payload: RegisterPayload) => register(payload),
  });
}
