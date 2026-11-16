import { createFileRoute } from "@tanstack/react-router";
import { MembersPage } from "../pages/members/members-page";

export const Route = createFileRoute("/members")({
  component: MembersPage,
});
