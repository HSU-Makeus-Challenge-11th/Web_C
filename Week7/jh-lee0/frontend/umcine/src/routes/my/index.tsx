import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/pages/my/my-page";

export const Route = createFileRoute("/my/")({
  component: MyPage,
});