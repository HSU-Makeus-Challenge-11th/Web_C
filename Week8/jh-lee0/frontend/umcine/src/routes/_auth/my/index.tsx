import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/pages/my/my-page";

export const Route = createFileRoute("/_auth/my/")({
  component: MyPage,
});