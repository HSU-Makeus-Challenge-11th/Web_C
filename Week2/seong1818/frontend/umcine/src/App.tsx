import { useState } from 'react'
import './App.css'
import { Header } from './components/header'
import { MovieGrid } from './components/movie-grid'
import { Pagination } from './components/pagination'
import { movies } from './data/movies'

function App() {
  const [currentPage, setCurrentPage] = useState(1)
  const [bookmarkedMovieIds, setBookmarkedMovieIds] = useState<Set<number>>(
    () => new Set(movies.filter((movie) => movie.isBookmarked).map((movie) => movie.id)),
  )

  const handleToggleBookmark = (movieId: number) => {
    setBookmarkedMovieIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (nextIds.has(movieId)) {
        nextIds.delete(movieId)
      } else {
        nextIds.add(movieId)
      }

      return nextIds
    })
  }

  return (
    <div className="app-shell">
      <Header />

      <main className="movie-list-page">
        <h1 className="page-title">영화 목록</h1>
        <MovieGrid
          movies={movies}
          bookmarkedMovieIds={bookmarkedMovieIds}
          onToggleBookmark={handleToggleBookmark}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </main>

      <footer className="site-footer">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </div>
  )
}

export default App
