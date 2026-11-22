"use client";

import { useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getMe, type MemberInfo } from "../../api/members/me";
import { getFavorites } from "../../api/favorites";
import { AccountPanel } from "../../components/account-panel";
import { RequestError } from "../../components/request-error";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useAuthStore } from "../../stores/auth-store";
import { useAuthHydrated } from "../../hooks/use-auth-hydrated";

export function ProfilePage({ editing = false }: { editing?: boolean }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthHydrated();
  useEffect(() => {
    if (hydrated && !accessToken) router.replace("/login");
  }, [hydrated, accessToken, router]);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    retry: false,
  });

  if (!hydrated || !accessToken) return null;

  const profile = meQuery.data;
  return (
    <AccountPanel
      title={editing ? "내 정보 수정" : "내 정보"}
      description={editing ? "새 닉네임을 입력해 주세요." : "가입한 계정의 이메일과 닉네임입니다."}
    >
      {meQuery.isPending && <p role="status">내 정보를 불러오는 중입니다.</p>}
      {meQuery.isError && !profile && (
        <RequestError message="내 정보를 불러오지 못했어요." onRetry={() => void meQuery.refetch()} />
      )}
      {profile && (editing
        ? <ProfileEditForm key={profile.email} profile={profile} />
        : <ProfileDetails profile={profile} />)}
    </AccountPanel>
  );
}

export function ProfileEditPage() {
  return <ProfilePage editing />;
}

function ProfileDetails({ profile }: { profile: MemberInfo }) {
  const favoritesQuery = useQuery({ queryKey: ["favorites"], queryFn: getFavorites, retry: false });
  return (
    <>
      <dl className="divide-y divide-gray-200 border-y border-gray-200">
        <div className="grid grid-cols-[4rem_1fr] items-baseline gap-4 py-4">
          <dt className="text-sm font-semibold text-gray-600">이메일</dt>
          <dd className="min-w-0 text-right wrap-anywhere">{profile.email}</dd>
        </div>
        <div className="grid grid-cols-[4rem_1fr] items-baseline gap-4 py-4">
          <dt className="text-sm font-semibold text-gray-600">닉네임</dt>
          <dd className="min-w-0 text-right wrap-anywhere">{profile.nickname}</dd>
        </div>
      </dl>
      <Link href="/me/edit" className="account-primary mt-7 w-full">내 정보 수정</Link>
      <section className="mt-8">
        <h2 className="text-lg font-bold">즐겨찾기</h2>
        {favoritesQuery.isPending && <p role="status" className="mt-3">즐겨찾기를 불러오는 중이에요.</p>}
        {favoritesQuery.isError && <div className="mt-3"><RequestError message="즐겨찾기를 불러오지 못했어요." onRetry={() => void favoritesQuery.refetch()} /></div>}
        {favoritesQuery.isSuccess && (
          favoritesQuery.data.length === 0
            ? <p className="mt-3 text-gray-600">즐겨찾기한 영화가 없어요.</p>
            : <ul className="mt-3 space-y-2">{favoritesQuery.data.map((favorite) => (
                <li key={favorite.favoriteId}><Link className="font-semibold text-brand hover:underline" href={`/movies/${favorite.movieId}`}>영화 #{favorite.movieId}</Link></li>
              ))}</ul>
        )}
      </section>
    </>
  );
}

function ProfileEditForm({ profile }: { profile: MemberInfo }) {
  const router = useRouter();
  const [nickname, setNickname] = useState(profile.nickname);
  const updateMeMutation = useUpdateMeMutation();

  const trimmedNickname = nickname.trim();
  const nicknameLength = Array.from(trimmedNickname).length;
  const nicknameInvalid = nicknameLength < 2 || nicknameLength > 12;
  const canSubmit = !nicknameInvalid && trimmedNickname !== profile.nickname;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;
    updateMeMutation.mutate(
      { nickname: trimmedNickname },
      { onSuccess: () => router.push("/me") },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="account-label">
        이메일
        <input className="account-input" type="email" name="email" value={profile.email} readOnly />
      </label>
      <div>
        <label className="account-label">
          닉네임
          <input className="account-input" name="nickname" autoComplete="nickname" required
            value={nickname} onChange={(event) => setNickname(event.target.value)}
            disabled={updateMeMutation.isPending}
            aria-invalid={nicknameInvalid} aria-describedby="nickname-hint" />
        </label>
        <p id="nickname-hint" className={`mt-2 text-sm ${nicknameInvalid ? "text-red-700" : "text-gray-600"}`}>
          닉네임은 2~12자로 입력해 주세요.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/me" className="inline-flex h-11 items-center justify-center rounded-md border border-gray-300 text-sm font-semibold hover:bg-gray-50">
          취소
        </Link>
        <button type="submit" className="account-primary" disabled={!canSubmit || updateMeMutation.isPending}>
          {updateMeMutation.isPending ? "저장 중" : "저장"}
        </button>
      </div>
    </form>
  );
}
