import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { BookmarkButton } from "../../components/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function isValidMovieId(movieId: number) {
  return Number.isInteger(movieId) && movieId > 0;
}

function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";

  return `${Math.floor(runtime / 60)}시간 ${runtime % 60}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidId = isValidMovieId(parsedMovieId);

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", parsedMovieId],
    queryFn: () => getMovieDetail(parsedMovieId),
    enabled: isValidId,
    staleTime: 30 * 1000, // 미니 실습: 상세 조회는 30초 동안 fresh로 취급해요.
  });

  // 유효하지 않은 번호에서는 요청하지 않아도 isPending이 참이므로 가장 먼저 처리해요.
  if (!isValidId) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }

  if (movieDetailQuery.isPending) {
    return <main>영화 정보를 불러오는 중이에요.</main>;
  }

  if (movieDetailQuery.isError) {
    return <main>{getMovieDetailErrorMessage(movieDetailQuery.error)}</main>;
  }

  const movie = movieDetailQuery.data;

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <main>
      {backdropUrl ? (
        <img
          className="h-[300px] w-full object-cover"
          src={backdropUrl}
          alt=""
          aria-hidden="true"
        />
      ) : (
        <div className="flex h-[300px] w-full items-center justify-center bg-[#e3e6eb] text-xs font-bold text-[#606774]">
          이미지 없음
        </div>
      )}
      <Link to="/">영화 목록</Link>
      {posterUrl ? (
        <img
          className="h-[300px] w-[200px] object-cover"
          src={posterUrl}
          alt={`${movie.title} 포스터`}
        />
      ) : (
        <div className="flex h-[300px] w-[200px] items-center justify-center bg-[#e3e6eb] text-xs font-bold text-[#606774]">
          이미지 없음
        </div>
      )}
      <h1>{movie.title}</h1>
      <BookmarkButton movieId={movie.id} />
      <p>{movie.original_title}</p>
      <p>{movie.release_date}</p>
      <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
      <p>{formatRuntime(movie.runtime)}</p>
      <h2>{movie.tagline}</h2>
      <p>{movie.overview}</p>
    </main>
  );
}