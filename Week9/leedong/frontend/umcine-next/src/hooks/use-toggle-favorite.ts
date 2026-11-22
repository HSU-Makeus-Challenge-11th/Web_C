import { useRouter } from "next/navigation";
import { useAddFavoriteMutation } from "./use-add-favorite-mutation";
import { useMemberId } from "./use-member-id";
import { useRemoveFavoriteMutation } from "./use-remove-favorite-mutation";

// 즐겨찾기 등록/해제를 하나로 묶어요. 로그인하지 않았다면 로그인 화면으로 보내요.
export function useToggleFavorite() {
  const router = useRouter();
  const memberId = useMemberId();
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();

  function toggleFavorite(movieId: number, isFavorite: boolean) {
    if (memberId === undefined) {
      alert("로그인이 필요해요.");
      router.push("/login");
      return;
    }

    if (isFavorite) {
      removeFavoriteMutation.mutate(movieId);
    } else {
      addFavoriteMutation.mutate(movieId);
    }
  }

  return {
    toggleFavorite,
    isPending: addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
}
