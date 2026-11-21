import { useState } from "react";
import {
  checkEmail,
  checkNickname,
  createMember,
} from "../../api/movies/members";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");

  const [emailChecked, setEmailChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const [emailMessage, setEmailMessage] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 중복 확인
  async function handleCheckEmail() {
    if (!email.trim()) {
      setEmailMessage("이메일을 입력해 주세요.");
      setEmailChecked(false);
      return;
    }

    try {
      const data = await checkEmail(email.trim());

      setEmailChecked(data.available);
      setEmailMessage(
        data.available
          ? "사용할 수 있는 이메일입니다."
          : "이미 사용 중인 이메일입니다.",
      );
    } catch (error) {
      setEmailChecked(false);
      setEmailMessage(
        error instanceof Error
          ? error.message
          : "이메일 확인 중 오류가 발생했습니다.",
      );
    }
  }

  // 닉네임 중복 확인
  async function handleCheckNickname() {
    if (!nickname.trim()) {
      setNicknameMessage("닉네임을 입력해 주세요.");
      setNicknameChecked(false);
      return;
    }

    try {
      const data = await checkNickname(nickname.trim());

      setNicknameChecked(data.available);
      setNicknameMessage(
        data.available
          ? "사용할 수 있는 닉네임입니다."
          : "이미 사용 중인 닉네임입니다.",
      );
    } catch (error) {
      setNicknameChecked(false);
      setNicknameMessage(
        error instanceof Error
          ? error.message
          : "닉네임 확인 중 오류가 발생했습니다.",
      );
    }
  }

  // 회원가입
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!emailChecked) {
      setMessage("이메일 중복 확인을 해 주세요.");
      return;
    }

    if (!nicknameChecked) {
      setMessage("닉네임 중복 확인을 해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      await createMember({
        email: email.trim(),
        password,
        nickname: nickname.trim(),
      });

      alert("회원가입이 완료되었습니다.");

      // 로그인 페이지 경로
      window.location.href = "/login";
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-2 text-center text-3xl font-extrabold text-gray-900">
          회원가입
        </h1>

        <p className="mb-8 text-center text-sm text-gray-500">
          영화 서비스를 이용하기 위한 계정을 만들어 보세요.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 이메일 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              이메일
            </label>

            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailChecked(false);
                  setEmailMessage("");
                }}
                placeholder="이메일을 입력하세요"
                autoComplete="email"
                required
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={handleCheckEmail}
                className="shrink-0 rounded-lg bg-gray-800 px-3 text-sm font-semibold text-white hover:bg-gray-700"
              >
                중복 확인
              </button>
            </div>

            {emailMessage && (
              <p
                className={`mt-2 text-sm ${
                  emailChecked ? "text-green-600" : "text-red-500"
                }`}
              >
                {emailMessage}
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              닉네임
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={nickname}
                onChange={(event) => {
                  setNickname(event.target.value);
                  setNicknameChecked(false);
                  setNicknameMessage("");
                }}
                placeholder="사용할 닉네임을 입력하세요"
                autoComplete="nickname"
                required
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={handleCheckNickname}
                className="shrink-0 rounded-lg bg-gray-800 px-3 text-sm font-semibold text-white hover:bg-gray-700"
              >
                중복 확인
              </button>
            </div>

            {nicknameMessage && (
              <p
                className={`mt-2 text-sm ${
                  nicknameChecked ? "text-green-600" : "text-red-500"
                }`}
              >
                {nicknameMessage}
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              비밀번호
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              비밀번호 확인
            </label>

            <input
              type="password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {passwordConfirm && (
              <p
                className={`mt-2 text-sm ${
                  password === passwordConfirm
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {password === passwordConfirm
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </p>
            )}
          </div>

          {/* 오류 메시지 */}
          {message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "가입 처리 중..." : "회원가입"}
          </button>
        </form>
      </div>
    </main>
  );
}
