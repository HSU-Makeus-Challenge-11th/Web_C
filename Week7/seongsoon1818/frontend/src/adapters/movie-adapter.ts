import type { TmdbMovieListItem } from "../api/movies/models";
import type { MovieCardData } from "../types/movie";
import { getTmdbPosterUrl } from "../utils/movies/tmdb-image";

// 서버의 snake_case 필드와 이미지 경로를 기존 카드의 UI 형식으로 변환합니다.
export function toMovieCardData(movie: TmdbMovieListItem): MovieCardData {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path),
    overview: movie.overview,
  };
}
