import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <li className="movie-card">
      <div className="movie-card__poster">
        <img src={movie.posterPath} alt={`${movie.title} 포스터`} loading="lazy" />
        <button
          type="button"
          className="movie-card__bookmark"
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? `${movie.title} 북마크 해제` : `${movie.title} 북마크 추가`}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <span
            className={movie.isBookmarked ? "icon icon--bookmark" : "icon icon--bookmark-outline"}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        <p className="movie-card__meta">
          <span>{movie.releaseDate}</span>
          <span>{movie.genres.join(", ")}</span>
        </p>
      </div>
    </li>
  );
}
