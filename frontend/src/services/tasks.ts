import { apiFetch } from "@/src/lib/api";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  completed?: boolean;
};

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export function fetchTasks() {
  return apiFetch<Task[]>("/tasks");
}

export function fetchTaskById(id: string) {
  return apiFetch<Task>(`/tasks/${id}`);
}

export function createTask(payload: CreateTaskPayload) {
  return apiFetch<Task>("/tasks", { method: "POST", body: payload });
}

export function updateTask(id: string, payload: UpdateTaskPayload) {
  return apiFetch<Task>(`/tasks/${id}`, { method: "PATCH", body: payload });
}

export function deleteTask(id: string) {
  return apiFetch<string>(`/tasks/${id}`, { method: "DELETE" });
}
