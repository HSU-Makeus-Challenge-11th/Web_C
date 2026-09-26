import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-20 text-center text-muted">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main>
      <div className="relative">
        <img
          className="h-[320px] w-full object-cover sm:h-[420px]"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
      </div>

      <div className="relative z-10 mx-auto -mt-28 max-w-[1200px] px-6 pb-16">
        <Link to="/" className="text-sm font-medium text-muted hover:text-text">
          ← 영화 목록
        </Link>

        <div className="mt-4 flex flex-col gap-8 sm:flex-row">
          <img
            className="w-[200px] shrink-0 rounded-xl object-cover shadow-lg"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />

          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-bold tracking-[-0.02em]">{movie.title}</h1>
            <p className="text-[15px] text-muted">{movie.originalTitle}</p>
            <p className="text-[15px] text-muted">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
            <h2 className="mt-4 text-lg font-semibold text-accent">{movie.tagline}</h2>
            <p className="mt-1 max-w-[760px] leading-[1.7]">{movie.overview}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
