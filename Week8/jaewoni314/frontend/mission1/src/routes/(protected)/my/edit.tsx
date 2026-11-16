import { createFileRoute } from "@tanstack/react-router";
import { MyInfoEditPage } from "../../../pages/my/my-info-edit-page";

export const Route = createFileRoute("/(protected)/my/edit")({
  component: MyInfoEditPage,
});
