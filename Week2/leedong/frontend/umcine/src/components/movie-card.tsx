import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster">
        <img className="poster-img" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <button
          type="button"
          className={movie.isBookmarked ? "bookmark-btn is-active" : "bookmark-btn"}
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
          />
        </button>
      </div>
      <h2 className="movie-title">{movie.title}</h2>
      <p className="movie-meta">{movie.releaseDate}</p>
    </article>
  );
}