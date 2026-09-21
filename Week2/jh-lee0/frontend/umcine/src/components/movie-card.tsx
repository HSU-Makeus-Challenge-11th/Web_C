import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        <img
          className="movie-card__image"
          src={movie.posterPath}
          alt={movie.title}
        />
        <button
          className={`bookmark-button ${movie.isBookmarked ? "is-active" : ""}`}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label="북마크"
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>
      <h3 className="movie-card__title">{movie.title}</h3>
      <p className="movie-card__date">{movie.releaseDate}</p>
    </article>
  );
}

export default MovieCard;