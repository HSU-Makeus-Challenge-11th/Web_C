import type { Movie } from '../types/movie'
import { MovieCard } from './movie-card'

interface MovieGridProps {
  movies: Movie[]
  bookmarkedMovieIds: ReadonlySet<number>
  onToggleBookmark: (movieId: number) => void
}

export function MovieGrid({
  movies,
  bookmarkedMovieIds,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <section id="movies" className="movie-grid" aria-label="영화 목록">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isBookmarked={bookmarkedMovieIds.has(movie.id)}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </section>
  )
}
