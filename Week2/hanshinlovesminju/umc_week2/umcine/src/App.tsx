import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <MovieGrid />
      <Pagination totalPages={1} />
    </>
  );
}

export default App;