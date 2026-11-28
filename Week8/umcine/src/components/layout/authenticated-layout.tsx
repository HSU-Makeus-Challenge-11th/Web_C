import { Outlet } from "@tanstack/react-router";

export function AuthenticatedLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
