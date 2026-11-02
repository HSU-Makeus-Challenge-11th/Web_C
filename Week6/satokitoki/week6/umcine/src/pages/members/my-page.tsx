import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useState } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { RatingResponse } from "../../api/members/models";

export function MyPage() {
  // 닉네임 중복 체크
  const [nickname, setNickname] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState<string | null>(null);

  // 이메일 중복 체크
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState<string | null>(null);

  // 유저별 평점 조회
  const [memberId, setMemberId] = useState("1");
  const [ratings, setRatings] = useState<RatingResponse[] | null>(null);
  const [ratingsMessage, setRatingsMessage] = useState<string | null>(null);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);

  async function handleNicknameCheck() {
    const value = nickname.trim();
    if (!value) {
      setNicknameMessage("닉네임을 입력해 주세요.");
      return;
    }
    setNicknameMessage("확인하는 중이에요...");
    try {
      const { available } = await checkNickname(value);
      setNicknameMessage(
        available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setNicknameMessage(
        "중복 확인에 실패했어요. 서버가 켜져 있는지 확인해 주세요.",
      );
    }
  }

  async function handleEmailCheck() {
    const value = email.trim();
    if (!value) {
      setEmailMessage("이메일을 입력해 주세요.");
      return;
    }
    setEmailMessage("확인하는 중이에요...");
    try {
      const { available } = await checkEmail(value);
      setEmailMessage(
        available
          ? "사용할 수 있는 이메일이에요."
          : "이미 가입된 이메일이에요.",
      );
    } catch {
      setEmailMessage(
        "중복 확인에 실패했어요. 서버가 켜져 있는지 확인해 주세요.",
      );
    }
  }

  async function handleLoadRatings() {
    const id = Number(memberId);
    if (!Number.isInteger(id) || id <= 0) {
      setRatings(null);
      setRatingsMessage("올바른 회원 번호를 입력해 주세요.");
      return;
    }
    setIsLoadingRatings(true);
    setRatings(null);
    setRatingsMessage(null);
    try {
      setRatings(await getMemberRatings(id));
    } catch (error) {
      setRatingsMessage(
        isHTTPError(error) && error.response.status === 404
          ? "존재하지 않는 유저예요."
          : "평점을 불러오지 못했어요.",
      );
    } finally {
      setIsLoadingRatings(false);
    }
  }

  return (
    <main className="flex-1 pt-8 pb-20">
      <div className="mx-auto flex w-full max-w-[880px] flex-col gap-8 px-5">
        <h1 className="text-4xl font-extrabold tracking-[-1px]">내 정보</h1>

        {/* 닉네임 중복 체크 */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">닉네임 중복 확인</h2>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              handleNicknameCheck();
            }}
          >
            <input
              name="nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="예: 수현"
              className="h-[42px] flex-1 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-900"
            />
            <button
              type="submit"
              className="h-[42px] rounded-lg bg-gray-900 px-4 text-sm font-bold text-white"
            >
              중복 확인
            </button>
          </form>
          {nicknameMessage && (
            <p className="mt-2 text-sm text-gray-600">{nicknameMessage}</p>
          )}
        </section>

        {/* 이메일 중복 체크 */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">이메일 중복 확인</h2>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              handleEmailCheck();
            }}
          >
            <input
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="예: noco@umc.com"
              className="h-[42px] flex-1 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-900"
            />
            <button
              type="submit"
              className="h-[42px] rounded-lg bg-gray-900 px-4 text-sm font-bold text-white"
            >
              중복 확인
            </button>
          </form>
          {emailMessage && (
            <p className="mt-2 text-sm text-gray-600">{emailMessage}</p>
          )}
        </section>

        {/* 유저별 평점 조회 */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">내 평점</h2>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              handleLoadRatings();
            }}
          >
            <input
              name="memberId"
              value={memberId}
              onChange={(event) => setMemberId(event.target.value)}
              placeholder="회원 번호"
              className="h-[42px] w-32 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-900"
            />
            <button
              type="submit"
              className="h-[42px] rounded-lg bg-gray-900 px-4 text-sm font-bold text-white"
            >
              평점 불러오기
            </button>
          </form>

          {isLoadingRatings && (
            <p className="mt-4 text-sm text-gray-500">
              평점을 불러오는 중이에요.
            </p>
          )}
          {ratingsMessage && (
            <p className="mt-4 text-sm text-red-500">{ratingsMessage}</p>
          )}
          {ratings && ratings.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              아직 남긴 평점이 없어요.
            </p>
          )}
          {ratings && ratings.length > 0 && (
            <ul className="mt-4 flex flex-col gap-3">
              {ratings.map((rating) => (
                <li
                  key={rating.ratingId}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(rating.movieId) }}
                      className="text-sm font-semibold text-[#1a66ff]"
                    >
                      영화 #{rating.movieId} 보러 가기
                    </Link>
                    <span className="text-sm font-bold">
                      {"★".repeat(rating.score)}
                      {"☆".repeat(5 - rating.score)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    {rating.comment ?? "코멘트가 없어요."}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(rating.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
