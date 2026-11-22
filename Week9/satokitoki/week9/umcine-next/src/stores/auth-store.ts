import { useSyncExternalStore } from "react";
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
      // 서버에는 localStorage가 없어요.
      // 서버와 브라우저의 첫 화면을 맞추려고, 저장된 값은 브라우저에서 화면이 뜬 뒤에 불러와요.
      skipHydration: true,
    },
  ),
);

// localStorage에서 토큰을 다 불러왔는지 알려 줘요. (서버에서는 항상 false)
export function useAuthHydrated() {
  return useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
