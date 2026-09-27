import { useState } from "react";
import "./App.css";
import { movies as initialMovies } from "./data/movies";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";

function App() {
  const [movieList, setMovieList] = useState(initialMovies);

  const handleToggleBookmark = (id: number) => {
    setMovieList((prev) =>
      prev.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };

  return (
    <>
      <Header />
      <main>
        <h1>영화 목록</h1>
        <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />
        <Pagination />
      </main>
      <footer className="footer">
        This product uses the TMDB API but is not endorsed or certified by
        TMDB.
      </footer>
    </>
  );
}

export default App;