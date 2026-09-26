import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img src={movie.posterPath} alt={movie.title} className="poster-img" />
        <button
          className={`bookmark-btn ${movie.isBookmarked ? "active" : ""}`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={movie.isBookmarked ? "/icon/bookmark.svg" : "/icon/bookmark-outline.svg"}
            alt={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
            style={{filter: "brightness(0) invert(1)"}}
          />
        </button>
      </div>
      <div className="movie-info">
        <p className="movie-title">{movie.title}</p>
        <p className="release-date">{movie.releaseDate}</p>
      </div>
    </article>
  );
}