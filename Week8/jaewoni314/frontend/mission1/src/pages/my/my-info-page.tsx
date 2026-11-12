import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { memberQueries } from "../../api/members/member-queries";
import { favoriteQueries } from "../../api/favorites/favorite-queries";
import { secondaryButtonClass } from "../../components/form/button-styles";
import { StatusMessage } from "../../components/movies/status-message";
import { FavoriteMovieList } from "../../components/my/favorite-movie-list";
import { useLogout } from "../../hooks/auth/use-logout";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

// "2026-11-12T10:46:25.000Z" → "2026년 11월 12일" (한국 시간 기준)
function formatJoinedAt(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  });
}

export function MyInfoPage() {
  // (protected) Layout을 지나왔으므로 토큰이 있어요. 헤더와 같은 key라서 헤더가 받아 둔 캐시를 그대로 써요.
  const meQuery = useQuery(memberQueries.me());
  // 아래 즐겨찾기 목록과 같은 key라서 요청은 한 번만 나가요.
  const favoriteCountQuery = useQuery({ ...favoriteQueries.list(), select: (favorites) => favorites.length });
  const logout = useLogout();

  if (meQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-[720px] px-6">
        <StatusMessage>내 정보를 불러오는 중이에요.</StatusMessage>
      </main>
    );
  }

  if (meQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-[720px] px-6">
        <StatusMessage isError>
          {getApiErrorMessage(meQuery.error, "내 정보를 불러오지 못했어요.")}
        </StatusMessage>
      </main>
    );
  }

  const me = meQuery.data;
  // 프로필 사진 대신 닉네임의 첫 글자를 보여 줘요.
  const avatarText = Array.from(me.nickname)[0] ?? "?";

  const infoRows = [
    { label: "이메일", value: me.email },
    { label: "닉네임", value: me.nickname },
    { label: "가입일", value: formatJoinedAt(me.createdAt) },
    { label: "즐겨찾기한 영화", value: favoriteCountQuery.isSuccess ? `${favoriteCountQuery.data}편` : "-" },
  ];

  return (
    <main className="mx-auto w-full max-w-[720px] px-6 pb-20 pt-12">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-[32px] font-bold tracking-[-0.02em]">내 정보</h1>
        <button type="button" className="text-sm font-medium text-muted hover:text-text" onClick={logout}>
          로그아웃
        </button>
      </div>

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
          <p className="break-all text-xl font-bold">{me.nickname}</p>
          <p className="mt-1 break-all text-[15px] text-muted">{me.email}</p>
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

      <FavoriteMovieList />
    </main>
  );
}
