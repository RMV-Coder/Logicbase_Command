// store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  first_name: string;
  last_name: string;
  birthdate:string;
  designation: string;
  company_name: string;
  contact_number: string;
  email: string;
  isActive?: boolean;
  profile_image?: string;
  date?: string;
  user_id?: string;
  role?: string;
  

  // loginData?: {
  //   time_in: string;
  //   time_in_image: string;
  //   time_out: string;
  //   time_out_image: string;
  // };
} | null;

interface UserState {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "logicbase-command-user-storage",
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated user store:", state);
      },
    }
  )
);
