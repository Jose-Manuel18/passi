import { fetchUserById, fetchUsers, updateUser } from "@/src/services/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUsersQuery() {
  return useQuery({ queryKey: ["users"], queryFn: () => fetchUsers() });
}

export function useUserQuery(id: string) {
  return useQuery({ queryKey: ["users", id], queryFn: () => fetchUserById(id), enabled: !!id });
}

export function useUpdateUserMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["users", id, "update"],
    mutationFn: (payload: Partial<{ name: string; email: string }>) => updateUser(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["users", id] });
    },
  });
}
