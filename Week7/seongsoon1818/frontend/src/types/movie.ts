// 카드·검색 결과에서 사용하는 기존 camelCase UI 필드만 선택합니다.
// 북마크는 API가 아닌 store에서 영화 ID로 계산합니다.
export type MovieCardData = Pick<
  Movie,
  "id" | "title" | "originalTitle" | "releaseDate" | "overview"
> & {
  posterPath: string | null;
};

export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string;
  backdropPath: string;
  genres: string[];
  runtime: string;
  tagline: string;
  overview: string;
  isBookmarked: boolean;
}