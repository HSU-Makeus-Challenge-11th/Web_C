import { mutationOptions } from "@tanstack/react-query";
import { signup } from "./signup";
import { updateMe } from "./update-me";

const memberMutations = {
  all: () => ["members"] as const,
  signup: () =>
    mutationOptions({
      mutationKey: [...memberMutations.all(), "signup"],
      mutationFn: signup,
    }),
  updateMe: () =>
    mutationOptions({
      mutationKey: [...memberMutations.all(), "me", "update"],
      mutationFn: updateMe,
    }),
};

export { memberMutations };
