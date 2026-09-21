import type { Movie } from '../types/movie'

interface MovieCardProps {
  movie: Movie
  isBookmarked: boolean
  onToggleBookmark: (movieId: number) => void
}

export function MovieCard({ movie, isBookmarked, onToggleBookmark }: MovieCardProps) {
  const bookmarkLabel = isBookmarked
    ? `${movie.title} 북마크 해제`
    : `${movie.title} 북마크 추가`

  return (
    <article className="movie-card">
      <div className="poster-wrap">
        <img src={movie.posterPath} alt={`${movie.title} 포스터`} loading="lazy" />
        <button
          className={`bookmark-button${isBookmarked ? ' is-bookmarked' : ''}`}
          type="button"
          aria-label={bookmarkLabel}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
            alt=""
          />
        </button>
      </div>
      <h2 className="movie-card-title">{movie.title}</h2>
      <p className="movie-release-date">{movie.releaseDate}</p>
    </article>
  )
}
