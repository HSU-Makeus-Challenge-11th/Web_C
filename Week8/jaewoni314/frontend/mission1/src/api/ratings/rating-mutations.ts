import { mutationOptions } from "@tanstack/react-query";
import { createRating, deleteRating, updateRating } from "./ratings";

const ratingMutations = {
  all: () => ["ratings"] as const,
  create: () =>
    mutationOptions({
      mutationKey: [...ratingMutations.all(), "create"],
      mutationFn: createRating,
    }),
  update: () =>
    mutationOptions({
      mutationKey: [...ratingMutations.all(), "update"],
      mutationFn: updateRating,
    }),
  remove: () =>
    mutationOptions({
      mutationKey: [...ratingMutations.all(), "delete"],
      mutationFn: deleteRating,
    }),
};

export { ratingMutations };
