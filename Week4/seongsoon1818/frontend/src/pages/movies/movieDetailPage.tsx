import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="mx-auto w-[calc(100%-48px)] max-w-[1280px] flex-1 py-20">
        <h1 className="text-2xl font-bold">
          영화를 찾을 수 없어요.
        </h1>
        <Link
          to="/"
          className="mt-6 inline-block font-semibold text-brand"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-white">
      <section className="relative isolate overflow-hidden bg-gray-950 text-white">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40"
        />

        <div className="relative mx-auto w-[calc(100%-32px)] max-w-[1280px] py-10 sm:w-[calc(100%-48px)]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            ← 영화 목록
          </Link>

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
            <img
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
              className="aspect-[2/3] w-[240px] shrink-0 rounded-xl object-cover shadow-xl"
            />

            <div className="min-w-0">
              <h1 className="text-3xl leading-tight font-bold tracking-[-0.04em] md:text-5xl">
                {movie.title}
              </h1>

              <p className="mt-3 text-lg text-white/70">
                {movie.originalTitle}
              </p>

              <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-white/60">개봉일</dt>
                  <dd className="mt-1">{movie.releaseDate}</dd>
                </div>

                <div>
                  <dt className="text-white/60">장르</dt>
                  <dd className="mt-1">{movie.genres.join(" · ")}</dd>
                </div>

                <div>
                  <dt className="text-white/60">상영 시간</dt>
                  <dd className="mt-1">{movie.runtime}</dd>
                </div>
              </dl>

              <p className="mt-8 text-xl font-medium">
                {movie.tagline}
              </p>
                
              <BookmarkButton
                movieId={movie.id}
                movieTitle={movie.title}
                className="mt-6"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[calc(100%-32px)] max-w-[1280px] py-10 sm:w-[calc(100%-48px)]">
        <h2 className="text-2xl font-bold">줄거리</h2>
        <p className="mt-4 max-w-[900px] leading-8 text-gray-600">
          {movie.overview}
        </p>
      </section>
    </main>
  );
}