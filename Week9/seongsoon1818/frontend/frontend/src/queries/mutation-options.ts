import { mutationOptions } from "@tanstack/react-query";
import { login } from "../api/auth/login";
import { signup } from "../api/members/signup";
import { updateMe } from "../api/members/update-me";
import { addFavorite, removeFavorite } from "../api/favorites";
import { createRating, deleteRating, updateRating, type RatingInput } from "../api/ratings";

export const loginMutationOptions = mutationOptions({
  mutationKey: ["auth", "login"],
  mutationFn: login,
});

export const signupMutationOptions = mutationOptions({
  mutationKey: ["members", "signup"],
  mutationFn: signup,
});

export const updateMeMutationOptions = mutationOptions({
  mutationKey: ["members", "updateMe"],
  mutationFn: updateMe,
});

export function favoriteMutationOptions(movieId: number) {
  return mutationOptions({
    mutationKey: ["favorites", movieId, "toggle"],
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) await removeFavorite(movieId);
      else await addFavorite(movieId);
    },
  });
}

export function saveRatingMutationOptions(movieId: number, ratingId: number | undefined) {
  return mutationOptions({
    mutationKey: ["ratings", movieId, "save"],
    mutationFn: async (input: RatingInput) => {
      if (ratingId) await updateRating(ratingId, input);
      else await createRating(movieId, input);
    },
  });
}

export function deleteRatingMutationOptions(movieId: number, ratingId: number | undefined) {
  return mutationOptions({
    mutationKey: ["ratings", movieId, "delete"],
    mutationFn: () => deleteRating(ratingId!),
  });
}
