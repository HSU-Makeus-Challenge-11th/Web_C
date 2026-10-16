import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { RatingResponse } from "../../api/members/models";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { cn } from "../../utils/cn";

type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

interface RatingWithTitle extends RatingResponse {
  movieTitle: string | null;
}

// 서버가 응답한 오류인지, 응답 자체를 받지 못했는지(서버 꺼짐, CORS) 구분해요.
function getRequestErrorMessage(error: unknown) {
  if (isHTTPError(error)) {
    if (error.response.status === 404) return "존재하지 않는 유저예요.";
    if (error.response.status === 400) return "요청 형식이 올바르지 않아요.";
    return `요청에 실패했어요. (${error.response.status})`;
  }
  return "서버에 연결하지 못했어요. 백엔드 서버와 CORS 설정을 확인해 주세요.";
}

const inputClass =
  "h-11 w-full max-w-sm rounded-lg border border-line bg-surface px-4 text-[15px] placeholder:text-muted";
const buttonClass =
  "h-11 shrink-0 rounded-lg bg-accent px-5 font-semibold text-bg hover:opacity-90 disabled:opacity-50";

function ResultMessage({ state }: { state: RequestState<boolean> }) {
  if (state.status === "idle") return null;
  if (state.status === "loading") return <p className="mt-3 text-sm text-muted">확인하는 중이에요.</p>;
  if (state.status === "error") {
    return (
      <p className="mt-3 text-sm text-red-400" role="alert">
        {state.message}
      </p>
    );
  }
  return (
    <p className={cn("mt-3 text-sm font-semibold", state.data ? "text-emerald-400" : "text-red-400")}>
      {state.data ? "사용할 수 있어요." : "이미 사용 중이에요."}
    </p>
  );
}

function DuplicateCheckSection({
  title,
  label,
  placeholder,
  request,
}: {
  title: string;
  label: string;
  placeholder: string;
  request: (value: string) => Promise<{ available: boolean }>;
}) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<RequestState<boolean>>({ status: "idle" });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    setState({ status: "loading" });
    try {
      const response = await request(trimmedValue);
      setState({ status: "success", data: response.available });
    } catch (error) {
      setState({ status: "error", message: getRequestErrorMessage(error) });
    }
  }

  return (
    <section className="rounded-xl border border-line p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
        <input
          className={inputClass}
          aria-label={label}
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="submit" className={buttonClass} disabled={state.status === "loading"}>
          중복 확인
        </button>
      </form>
      <ResultMessage state={state} />
    </section>
  );
}

function MemberRatingsSection() {
  const [memberId, setMemberId] = useState("1");
  const [state, setState] = useState<RequestState<RatingWithTitle[]>>({ status: "idle" });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedMemberId = Number(memberId);
    if (!Number.isInteger(parsedMemberId) || parsedMemberId <= 0) {
      setState({ status: "error", message: "회원 번호는 1 이상의 정수로 입력해 주세요." });
      return;
    }

    setState({ status: "loading" });
    try {
      const ratings = await getMemberRatings(parsedMemberId);
      // 평점에는 TMDB movieId만 있으므로, 영화 제목은 TMDB 상세 API로 가져와요.
      const details = await Promise.allSettled(ratings.map((rating) => getMovieDetail(rating.movieId)));
      setState({
        status: "success",
        data: ratings.map((rating, index) => {
          const detail = details[index];
          return { ...rating, movieTitle: detail.status === "fulfilled" ? detail.value.title : null };
        }),
      });
    } catch (error) {
      setState({ status: "error", message: getRequestErrorMessage(error) });
    }
  }

  return (
    <section className="rounded-xl border border-line p-6">
      <h2 className="text-lg font-bold">유저별 평점 조회</h2>
      <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
        <input
          className={cn(inputClass, "max-w-[160px]")}
          aria-label="회원 번호"
          inputMode="numeric"
          placeholder="회원 번호"
          value={memberId}
          onChange={(event) => setMemberId(event.target.value)}
        />
        <button type="submit" className={buttonClass} disabled={state.status === "loading"}>
          평점 조회
        </button>
      </form>

      {state.status === "loading" && <p className="mt-3 text-sm text-muted">평점을 불러오는 중이에요.</p>}
      {state.status === "error" && (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {state.message}
        </p>
      )}
      {state.status === "success" &&
        (state.data.length === 0 ? (
          <p className="mt-3 text-sm text-muted">아직 남긴 평점이 없어요.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {state.data.map((rating) => (
              <li key={rating.ratingId} className="rounded-lg bg-surface p-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(rating.movieId) }}
                    className="font-semibold hover:text-accent"
                  >
                    {rating.movieTitle ?? `영화 #${rating.movieId}`}
                  </Link>
                  <span className="text-accent" aria-label={`별점 ${rating.score}점`}>
                    {"★".repeat(rating.score)}
                    <span className="text-line">{"★".repeat(5 - rating.score)}</span>
                  </span>
                </div>
                <p className="mt-1 text-sm">{rating.comment ?? "코멘트 없음"}</p>
                <p className="mt-1 text-xs text-muted">
                  평점 #{rating.ratingId} · movieId {rating.movieId} ·{" "}
                  {new Date(rating.createdAt).toLocaleString("ko-KR")}
                </p>
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}

export function MembersPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-16 pt-12">
      <h1 className="text-[32px] font-bold tracking-[-0.02em]">회원 API 확인</h1>
      <p className="mt-2 text-[15px] text-muted">UMC 백엔드(NestJS) API를 직접 호출해요.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DuplicateCheckSection
          title="닉네임 중복 체크"
          label="닉네임"
          placeholder="닉네임 (예: 수현)"
          request={checkNickname}
        />
        <DuplicateCheckSection
          title="이메일 중복 체크"
          label="이메일"
          placeholder="이메일 (예: noco@umc.com)"
          request={checkEmail}
        />
      </div>

      <div className="mt-6">
        <MemberRatingsSection />
      </div>
    </main>
  );
}
