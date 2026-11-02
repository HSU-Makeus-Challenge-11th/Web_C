import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "../pages/movies/singup-page";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});
