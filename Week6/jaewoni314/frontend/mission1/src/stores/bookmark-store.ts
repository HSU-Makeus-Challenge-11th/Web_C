import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

// 저장값은 개발자 도구에서 바뀔 수 있으므로 양의 정수인 영화 ID만 남겨요.
function toBookmarkIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (movieId): movieId is number => Number.isInteger(movieId) && movieId > 0,
  );
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarkedMovieIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
      // 저장값을 store에 합칠 때 형태를 확인해요. 배열이 아니면 빈 배열로 시작해요.
      merge: (persistedState, currentState) => ({
        ...currentState,
        bookmarkedMovieIds: toBookmarkIds(
          (persistedState as Partial<BookmarkStore> | undefined)?.bookmarkedMovieIds,
        ),
      }),
    },
  ),
);
