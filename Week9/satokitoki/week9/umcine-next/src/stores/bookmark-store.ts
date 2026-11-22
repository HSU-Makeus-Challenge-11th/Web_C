import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
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
      partialize: (state) => ({ bookmarkedMovieIds: state.bookmarkedMovieIds }),
      // 서버와 브라우저의 첫 화면을 맞추려고 브라우저에서 화면이 뜬 뒤에 불러와요.
      skipHydration: true,
    },
  ),
);
