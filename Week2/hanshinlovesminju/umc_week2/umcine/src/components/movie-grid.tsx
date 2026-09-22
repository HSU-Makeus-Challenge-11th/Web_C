import { useState } from "react";
import { movies as initialMovies } from "../data/movies";
import MovieCard from "./movie-card";
import "./movie-grid.css";

function MovieGrid() {
  const [movies, setMovies] = useState(initialMovies);

  const handleToggleBookmark = (id: number) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isBookmarked: !m.isBookmarked } : m))
    );
  };

  return (
    <section className="movie-grid-section">
      <h2 className="movie-grid-section__title">영화 목록</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onToggleBookmark={handleToggleBookmark} />
        ))}
      </div>
    </section>
  );
}

export default MovieGrid;