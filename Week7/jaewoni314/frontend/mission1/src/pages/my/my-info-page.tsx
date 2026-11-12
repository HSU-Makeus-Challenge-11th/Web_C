import { Link } from "@tanstack/react-router";
import { secondaryButtonClass } from "../../components/form/button-styles";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { useMyInfoStore } from "../../stores/my-info-store";

// "2026-09-13" → "2026년 9월 13일". Date로 바꾸지 않아 시간대에 따라 날짜가 바뀌지 않아요.
function formatJoinedAt(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

export function MyInfoPage() {
  const myInfo = useMyInfoStore((state) => state.myInfo);
  const bookmarkCount = useBookmarkStore((state) => state.bookmarkedMovieIds.length);

  // 프로필 사진 대신 닉네임의 첫 글자를 보여 줘요.
  const avatarText = Array.from(myInfo.nickname)[0] ?? "?";

  const infoRows = [
    { label: "이메일", value: myInfo.email },
    { label: "닉네임", value: myInfo.nickname },
    { label: "가입일", value: formatJoinedAt(myInfo.joinedAt) },
    { label: "북마크한 영화", value: `${bookmarkCount}편` },
  ];

  return (
    <main className="mx-auto w-full max-w-[720px] px-6 pb-20 pt-12">
      <h1 className="text-[32px] font-bold tracking-[-0.02em]">내 정보</h1>
      <p className="mt-2 text-[15px] text-muted">
        8주차에 내 정보 조회 API를 연결하기 전까지 예시 회원 정보를 보여 줘요.
      </p>

      <section
        className="mt-8 flex flex-col items-center gap-5 rounded-xl border border-line p-6 sm:flex-row"
        aria-label="프로필"
      >
        <div className="relative shrink-0">
          <div
            className="grid size-20 place-items-center rounded-full bg-surface text-[32px] font-bold text-accent"
            aria-hidden="true"
          >
            {avatarText}
          </div>
          <Link
            to="/my/edit"
            className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full bg-bg text-accent hover:text-text"
            aria-label="내 정보 수정"
          >
            <span className="icon icon--edit size-6" aria-hidden="true" />
          </Link>
        </div>

        <div className="min-w-0 text-center sm:text-left">
          <p className="break-all text-xl font-bold">{myInfo.nickname}</p>
          <p className="mt-1 break-all text-[15px] text-muted">{myInfo.email}</p>
        </div>

        <Link to="/my/edit" className={`${secondaryButtonClass} sm:ml-auto`}>
          내 정보 수정
        </Link>
      </section>

      <dl className="mt-6 divide-y divide-line rounded-xl border border-line">
        {infoRows.map((row) => (
          <div key={row.label} className="flex items-center gap-4 px-6 py-4">
            <dt className="w-28 shrink-0 text-sm text-muted">{row.label}</dt>
            <dd className="min-w-0 break-all text-[15px]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
