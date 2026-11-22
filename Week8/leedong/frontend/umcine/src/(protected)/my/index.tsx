import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/pages/my/my-page";   // ← 이 줄만 변경

export const Route = createFileRoute("/(protected)/my/")({ component: MyPage });