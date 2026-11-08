import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AccountPanel } from "../../components/account-panel";
import { useProfilePreview } from "../../stores/profile-preview-store";

export function ProfilePage() {
  const { email, nickname } = useProfilePreview((state) => state.profile);
  return (
    <AccountPanel title="내 정보" description="현재 탭에 저장된 미리보기 프로필입니다.">
      <dl className="divide-y divide-gray-200 border-y border-gray-200">
        <div className="grid grid-cols-[4rem_1fr] items-baseline gap-4 py-4">
          <dt className="text-sm font-semibold text-gray-600">이메일</dt>
          <dd className="min-w-0 text-right wrap-anywhere">{email}</dd>
        </div>
        <div className="grid grid-cols-[4rem_1fr] items-baseline gap-4 py-4">
          <dt className="text-sm font-semibold text-gray-600">닉네임</dt>
          <dd className="min-w-0 text-right wrap-anywhere">{nickname}</dd>
        </div>
      </dl>
      <Link to="/me/edit" className="account-primary mt-7 w-full">내 정보 수정</Link>
    </AccountPanel>
  );
}

export function ProfileEditPage() {
  const navigate = useNavigate();
  const { profile, saveProfile } = useProfilePreview();
  const [email, setEmail] = useState(profile.email);
  const [nickname, setNickname] = useState(profile.nickname);
  const trimmedNickname = nickname.trim();
  const nicknameLength = Array.from(trimmedNickname).length;
  const nicknameInvalid = nicknameLength < 2 || nicknameLength > 12;
  const changed = email.trim() !== profile.email || trimmedNickname !== profile.nickname;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (nicknameInvalid || !changed) return;
    saveProfile({ email: email.trim(), nickname: trimmedNickname });
    void navigate({ to: "/me" });
  }

  return (
    <AccountPanel title="내 정보 수정" description="저장한 내용은 이 탭의 내 정보 화면에 반영됩니다.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="account-label">
          이메일
          <input className="account-input" type="email" name="email" autoComplete="email" required
            value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <div>
          <label className="account-label">
            닉네임
            <input className="account-input" name="nickname" autoComplete="nickname" required
              value={nickname} onChange={(event) => setNickname(event.target.value)}
              aria-invalid={nicknameInvalid} aria-describedby="nickname-hint" />
          </label>
          <p id="nickname-hint" className={`mt-2 text-sm ${nicknameInvalid ? "text-red-700" : "text-gray-600"}`}>
            닉네임은 2~12자로 입력해 주세요.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/me" className="inline-flex h-11 items-center justify-center rounded-md border border-gray-300 text-sm font-semibold hover:bg-gray-50">
            취소
          </Link>
          <button type="submit" className="account-primary" disabled={!changed || nicknameInvalid || !email.trim()}>
            저장
          </button>
        </div>
      </form>
    </AccountPanel>
  );
}
