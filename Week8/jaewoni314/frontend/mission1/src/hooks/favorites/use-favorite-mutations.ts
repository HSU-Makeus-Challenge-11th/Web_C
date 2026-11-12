import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Favorite, FavoriteStatus } from "../../api/favorites/favorites";
import { addFavorite, removeFavorite } from "../../api/favorites/favorites";
import { favoriteQueries } from "../../api/favorites/favorite-queries";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

// 즐겨찾기 등록/해제는 응답이나 요청값만으로 바뀐 결과를 정확히 알 수 있어서 setQueryData로 캐시를 바로 바꿔요.
// 다시 조회하지 않아서 버튼이 바로 바뀌고, 요청도 한 번만 나가요.

export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    onSuccess: (favorite) => {
      // 상세 화면의 여부 캐시: 방금 등록했으니 true
      queryClient.setQueryData<FavoriteStatus>(favoriteQueries.status(favorite.movieId).queryKey, {
        isFavorite: true,
      });
      // 목록 캐시: 서버가 돌려준 즐겨찾기를 맨 앞에 넣어요. (목록은 최근에 등록한 순서)
      // 아직 목록을 조회한 적이 없으면(undefined) 그대로 두고, 나중에 처음 조회할 때 받아 와요.
      queryClient.setQueryData<Favorite[]>(favoriteQueries.list().queryKey, (prev) =>
        prev ? [favorite, ...prev.filter((item) => item.movieId !== favorite.movieId)] : prev,
      );
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "즐겨찾기에 추가하지 못했어요. 다시 시도해 주세요."));
      // 다른 탭에서 이미 등록해 409가 났을 수 있어서, 화면이 서버와 달라졌으면 다시 맞춰요.
      queryClient.invalidateQueries({ queryKey: favoriteQueries.all() });
    },
  });
}

export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    // 해제 응답의 result는 null이라, 요청에 보낸 movieId(variables)로 캐시를 바꿔요.
    onSuccess: (_data, movieId) => {
      queryClient.setQueryData<FavoriteStatus>(favoriteQueries.status(movieId).queryKey, {
        isFavorite: false,
      });
      queryClient.setQueryData<Favorite[]>(favoriteQueries.list().queryKey, (prev) =>
        prev?.filter((item) => item.movieId !== movieId),
      );
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "즐겨찾기를 해제하지 못했어요. 다시 시도해 주세요."));
      queryClient.invalidateQueries({ queryKey: favoriteQueries.all() });
    },
  });
}
