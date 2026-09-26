import { useState } from "react";
import Header from "./components/header";
import Moviegrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";
import type { Movie } from "./types/movie";
import "./App.css"

export default function App() {

  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }
  return (
    <main>
      <Header />
      <h2 className="page-title">영화 목록</h2>
     <Moviegrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      <Pagination />
    </main>
  );
}