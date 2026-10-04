import { create } from "zustand";
// 1. Zustand에서 로컬 스토리지 자동 저장을 담당하는 persist, createJSONStorage 가져오기
import { createJSONStorage, persist } from "zustand/middleware";

// Store에서 사용할 데이터와 함수의 타입 정의 (인터페이스)
interface BookmarkStore {
  bookmarkedMovieIds: number[];  // 1. number 타입의 배열 (상태)
  toggleBookmark: (movieId: number) => void; // 2. number 타입의 매개변수를 받는 void가 반환값인 함수 (액션)
}

// Zustand store 생성 및 내보내기 / BookmarkStore를 구현
export const useBookmarkStore = create<BookmarkStore>()(
  // 💡 [5.1) 추가된 부분 1] 기존 (set) => ({ ... }) 코드 전체를 persist() 로 감싸줌
  persist(
    (set) => ({
      // 1. 상태(State): 현재 북마크된 영화 ID 리스트 (초기값: 빈 배열)
      bookmarkedMovieIds: [],

      // 2. 액션(Action): 영화 ID를 받아서 북마크를 켜고 끄는 메서드
      toggleBookmark: (movieId) =>
        set((state) => ({ // state는 Zustand 객체가 가진 '전역 데이터 객체'
            
          // 현재 리스트에 해당 movieId가 있는지 확인 (if-else문)
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId) // [If] 있으면: 해당 ID를 삭제한 새 리스트로 교체
            : [...state.bookmarkedMovieIds, movieId],                 // [Else] 없으면: 기존 리스트 뒤에 새 ID를 추가한 새 리스트로 교체
        })),
    }),
    // 💡 [5.1) 추가된 부분 2] persist의 세부 설정 (어디에, 어떤 키로 저장할지 지정)
    {
      // 1) 로컬 스토리지에 저장될 Key 이름 설정 (Key: "umcine-bookmark-store")
      name: "umcine-bookmark-store",
      // 2) 사용할 브라우저 저장소로 localStorage 지정 (JSON 변환 자동 처리)
      storage: createJSONStorage(() => localStorage),
      // 3) 스토어 안의 데이터 중 'bookmarkedMovieIds' 상태만 골라서 저장 (함수 제외)
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
    },
  ),
);