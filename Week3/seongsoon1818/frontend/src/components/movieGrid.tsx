import type { Movie } from '../types/movie'
import { MovieCard } from './movieCard'

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
    <section
      id="movies"
      aria-label="영화 목록"
      className="grid grid-cols-1 gap-x-3.5 gap-y-6 min-[461px]:grid-cols-2 min-[641px]:gap-x-5 min-[641px]:gap-y-7 min-[721px]:grid-cols-3 min-[1025px]:grid-cols-5"
    >
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
