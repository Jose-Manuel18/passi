import {
  createTask,
  CreateTaskPayload,
  deleteTask,
  fetchTaskById,
  fetchTasks,
  updateTask,
  UpdateTaskPayload,
} from "@/src/services/tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTasksQuery() {
  return useQuery({ queryKey: ["tasks"], queryFn: () => fetchTasks() });
}

export function useTaskQuery(id: string) {
  return useQuery({ queryKey: ["tasksById", id], queryFn: () => fetchTaskById(id), enabled: !!id });
}

export function useCreateTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["createTask"],
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTaskMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["updateTask", id],
    mutationFn: (payload: UpdateTaskPayload) => updateTask(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["deleteTask"],
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
