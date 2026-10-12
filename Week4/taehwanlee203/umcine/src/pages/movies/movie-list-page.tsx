import Moviegrid from "../../components/movies/movie-grid";
import { movies } from "../../data/movies";
import "../../App.css";

export function MovieListPage() {
  return (
    <main>
      <h2 className="page-title">영화 목록</h2>
      <Moviegrid movies={movies} />
    </main>
  );
}
