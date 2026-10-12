import { useState } from "react";
import type { Movie } from "./types/movie";
import { movies } from "./data/movies";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import Footer from "./components/footer";
import "./App.css";

export default function App() {
  const [movieList, setMovieList] = useState<Movie[]>(movies);

  const handleToggleBookmark = (id: number) => {
    setMovieList((prev) =>
      prev.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  return (
    <>
      <Header />
      <main className="main">
        <div className="inner">
          <h2 className="page-title">영화 목록</h2>
          <MovieGrid
            movies={movieList}
            onToggleBookmark={handleToggleBookmark}
          />
          <Pagination />
        </div>
      </main>
      <Footer />
    </>
  );
}
