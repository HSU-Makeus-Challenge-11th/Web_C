import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";
import "./App.css";

const TOTAL_PAGES = 5;

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  }

  return (
    <>
      <Header />

      <main className="page">
        <div className="page__heading">
          <h1 className="page__title">영화 목록</h1>
          <p className="page__count">{movies.length}편</p>
        </div>

        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />

        <Pagination
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          onPageChange={setCurrentPage}
        />
      </main>

      <footer className="footer">
        <img className="footer__logo" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </>
  );
}
