import { apiFetch } from "@/src/lib/api";

export type LoginPayload = { email: string; password: string };
export type LoginResponse = { access_token: string };
export type RegisterPayload = { name: string; email: string; password: string };

export function login(payload: LoginPayload) {
  return apiFetch<LoginResponse>("/auth/login", { method: "POST", body: payload });
}

export function register(payload: RegisterPayload) {
  return apiFetch<string>("/auth/register", { method: "POST", body: payload });
}
