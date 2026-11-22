import type { ReactNode } from "react";
import { ProtectedGuard } from "@/components/auth/auth-guards";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <ProtectedGuard>{children}</ProtectedGuard>;
}
