import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
      // 9주차: 서버에는 localStorage가 없으므로 처음엔 읽지 않고,
      // 브라우저에서 화면이 뜬 뒤 providers.tsx에서 rehydrate()로 읽어옴
      skipHydration: true,
    },
  ),
);