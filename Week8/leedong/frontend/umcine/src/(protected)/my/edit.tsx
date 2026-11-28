import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "@/pages/my/my-edit-page";   // ← 이 줄만 변경

export const Route = createFileRoute("/(protected)/my/edit")({ component: MyEditPage });