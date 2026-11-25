import { mutationOptions } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "./favorites";

// key가 "favorites"로 시작해서 useIsMutating({ mutationKey: favoriteMutations.all() })로
// 즐겨찾기 요청이 진행 중인지 화면 어디서든 확인할 수 있어요.
const favoriteMutations = {
  all: () => ["favorites"] as const,
  add: () =>
    mutationOptions({
      mutationKey: [...favoriteMutations.all(), "add"],
      mutationFn: addFavorite,
    }),
  remove: () =>
    mutationOptions({
      mutationKey: [...favoriteMutations.all(), "remove"],
      mutationFn: removeFavorite,
    }),
};

export { favoriteMutations };
