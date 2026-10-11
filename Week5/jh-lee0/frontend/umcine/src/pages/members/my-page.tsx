import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useState, type FormEvent } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { getMemberRatings } from "../../api/members/get-member-rating";
import type { Rating } from "../../api/members/models";
import { getTmdbPosterUrl } from "../../utils/tmdb-image";

const CONNECTION_ERROR =
  "서버에 연결하지 못했어요. 백엔드 서버가 켜져 있는지, CORS 설정을 확인해 주세요.";

function CheckSection({
  title,
  placeholder,
  check,
}: {
  title: string;
  placeholder: string;
  check: (value: string) => Promise<{ available: boolean }>;
}) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setMessage("값을 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    check(trimmed)
      .then((response) => {
        setMessage(
          response.available
            ? "사용할 수 있어요. (available: true)"
            : "이미 사용 중이에요. (available: false)",
        );
      })
      .catch((error) => {
        setMessage(
          isHTTPError(error)
            ? `서버가 오류로 응답했어요. (${error.response.status})`
            : CONNECTION_ERROR,
        );
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="h-[42px] w-72 rounded-lg border border-[#e3e6eb] px-3"
          aria-label={title}
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button
          type="submit"
          className="h-[42px] rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-gray-800"
        >
          중복 확인
        </button>
      </form>
      {isLoading ? <p className="mt-2">확인하는 중이에요.</p> : null}
      {message ? <p className="mt-2">{message}</p> : null}
    </section>
  );
}

interface RatingWithMovie {
  rating: Rating;
  movie: TmdbMovieDetail | null;
}

// 백엔드의 평점(movieId)에 TMDB 영화 정보를 붙여요.
async function loadRatingsWithMovies(
  memberId: number,
): Promise<RatingWithMovie[]> {
  const ratings = await getMemberRatings(memberId);
  const movieIds = [...new Set(ratings.map((rating) => rating.movieId))];
  const results = await Promise.allSettled(
    movieIds.map((movieId) => getMovieDetail(movieId)),
  );

  const movieMap = new Map<number, TmdbMovieDetail>();
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      movieMap.set(movieIds[index], result.value);
    }
  });

  return ratings.map((rating) => ({
    rating,
    movie: movieMap.get(rating.movieId) ?? null,
  }));
}

function RatingsSection() {
  const [memberIdText, setMemberIdText] = useState("1");
  const [items, setItems] = useState<RatingWithMovie[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const memberId = Number(memberIdText);

    if (!Number.isInteger(memberId) || memberId <= 0) {
      setItems(null);
      setErrorMessage("올바른 유저 번호를 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    setItems(null);
    setErrorMessage(null);

    loadRatingsWithMovies(memberId)
      .then(setItems)
      .catch((error) => {
        if (isHTTPError(error) && error.response.status === 404) {
          setErrorMessage("존재하지 않는 유저입니다.");
        } else if (isHTTPError(error)) {
          setErrorMessage(`서버가 오류로 응답했어요. (${error.response.status})`);
        } else {
          setErrorMessage(CONNECTION_ERROR);
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">유저별 평점 조회</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="h-[42px] w-72 rounded-lg border border-[#e3e6eb] px-3"
          aria-label="유저 번호"
          placeholder="유저 번호 (예: 1)"
          value={memberIdText}
          onChange={(event) => setMemberIdText(event.target.value)}
        />
        <button
          type="submit"
          className="h-[42px] rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-gray-800"
        >
          평점 조회
        </button>
      </form>

      {isLoading ? <p className="mt-2">평점을 불러오는 중이에요.</p> : null}
      {errorMessage ? <p className="mt-2">{errorMessage}</p> : null}
      {items && items.length === 0 ? (
        <p className="mt-2">등록한 평점이 없어요.</p>
      ) : null}
      {items && items.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-3">
          {items.map(({ rating, movie }) => {
            const posterUrl = getTmdbPosterUrl(movie?.poster_path ?? null);
            return (
              <li
                key={rating.ratingId}
                className="flex gap-4 rounded-lg border border-[#e3e6eb] p-4"
              >
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={movie?.title ?? ""}
                    className="h-24 w-16 rounded object-cover"
                  />
                ) : (
                  <div className="grid h-24 w-16 place-items-center rounded bg-gray-200 text-xs text-gray-500">
                    이미지 없음
                  </div>
                )}
                <div>
                  {movie ? (
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="font-bold hover:underline"
                    >
                      {movie.title}
                    </Link>
                  ) : (
                    <p className="font-bold">
                      영화 ID {rating.movieId}
                      <span className="ml-2 text-sm font-normal text-[#606774]">
                        (영화 정보를 불러오지 못했어요)
                      </span>
                    </p>
                  )}
                  <p>★ {rating.score}</p>
                  <p>{rating.comment ?? "코멘트가 없어요."}</p>
                  <p className="text-sm text-[#606774]">
                    작성 {rating.createdAt.replace("T", " ")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

export function MyPage() {
  return (
    <main className="mx-auto w-[calc(100%-48px)] max-w-[1280px] py-10">
      <h1 className="mb-8 text-2xl font-black">내 정보</h1>
      <CheckSection
        title="닉네임 중복 확인"
        placeholder="닉네임 (예: 수현)"
        check={checkNickname}
      />
      <CheckSection
        title="이메일 중복 확인"
        placeholder="이메일 (예: noco@umc.com)"
        check={checkEmail}
      />
      <RatingsSection />
    </main>
  );
}