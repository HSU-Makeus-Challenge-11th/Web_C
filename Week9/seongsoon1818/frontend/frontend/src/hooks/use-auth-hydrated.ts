"use client";

import { useSyncExternalStore } from "react";
import { useAuthStore } from "../stores/auth-store";

export function useAuthHydrated() {
  return useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
