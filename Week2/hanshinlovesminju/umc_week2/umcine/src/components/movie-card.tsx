import type { Movie } from "../types/movie";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="movie-card__poster-wrap">
        <img
          className="movie-card__poster"
          src={movie.posterPath}
          alt={movie.title}
        />
        <button
          type="button"
          className="movie-card__bookmark-btn"
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
        >
          <img
            src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
          />
        </button>
      </div>
      <p className="movie-card__title">{movie.title}</p>
      <p className="movie-card__date">{movie.releaseDate}</p>
    </div>
  );
}

export default MovieCard;