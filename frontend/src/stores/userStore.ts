import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User) =>
    set((state) => ({
      user: { ...state.user, ...user },
    })),
  logout: () => set({ user: null }),
}));

export default useUserStore;
