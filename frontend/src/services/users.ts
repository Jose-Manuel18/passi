import { apiFetch } from "@/src/lib/api";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export function fetchUsers() {
  return apiFetch<User[]>("/findAll");
}

export function fetchUserById(id: string) {
  return apiFetch<User>(`/findOne/${id}`);
}

export function updateUser(id: string, payload: Partial<{ name: string; email: string }>) {
  return apiFetch<string>(`/update/${id}`, { method: "PUT", body: payload });
}
