import { createFileRoute } from "@tanstack/react-router";
import { ProfileEditPage } from "../../../pages/members/profile-page";

export const Route = createFileRoute("/(protected)/me/edit")({ component: ProfileEditPage });
