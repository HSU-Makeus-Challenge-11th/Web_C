import Moviegrid from "../../components/movies/movie-grid";
import { getMovies } from "../../api/movies/get-movies";
import { useEffect, useState } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import type { Movie } from "../../types/movie";
import "../../App.css";

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });

        if (!ignore) {
          const convertedMovies: Movie[] = response.results.map(
            (movie: TmdbMovieListItem) => ({
              id: movie.id,
              title: movie.title,
              originalTitle: movie.original_title,
              releaseDate: movie.release_date,
              posterPath: movie.poster_path ?? "",
              backdropPath: movie.backdrop_path ?? "",
              genres: [],
              runtime: "",
              tagline: "",
              overview: movie.overview,
              isBookmarked: false,
            }),
          );

          setMovies(convertedMovies);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main>
      <h2 className="page-title">영화 목록</h2>

      {isLoading ? (
        <p>영화 목록을 불러오는 중입니다...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <Moviegrid movies={movies} />
      )}
    </main>
  );
}
