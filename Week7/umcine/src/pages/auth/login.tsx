import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { login } from "../../api/members/login";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 버튼 클릭
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }

    if (!password) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      const data = await login({
        email: email.trim(),
        password,
      });

      // JWT 토큰 저장
      localStorage.setItem("accessToken", data.result.accessToken);

      // 사용자 닉네임 저장
      localStorage.setItem("nickname", data.result.nickname);

      // 로그인 성공 후 메인 페이지 이동
      await navigate({ to: "/" });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
        {/* 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">로그인</h1>

          <p className="mt-2 text-sm text-gray-500">
            이메일과 비밀번호를 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* 이메일 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              이메일
            </label>

            <div className="relative">
              <img
                src="/icon/mail.svg"
                alt=""
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요."
                autoComplete="email"
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              비밀번호
            </label>

            <div className="relative">
              <img
                src="/icon/lock.svg"
                alt=""
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              />

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요."
                autoComplete="current-password"
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* 오류 메시지 */}
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 회원가입 이동 */}
        <div className="mt-7 text-center text-sm text-gray-500">
          아직 회원이 아니신가요?{" "}
          <Link
            to="/signup"
            className="text-[#2563EB] font-semibold hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
