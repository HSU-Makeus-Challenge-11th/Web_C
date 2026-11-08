import { useEffect, useState } from "react";
import { getMyInfo } from "../../api/members/get-my-info";
import { updateMyInfo } from "../../api/members/update-my-info";

interface MyInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export function RatingsPage() {
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const [nickname, setNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 내 정보 조회
  useEffect(() => {
    async function fetchMyInfo() {
      try {
        const response = await getMyInfo();

        setMyInfo(response.result);
        setNickname(response.result.nickname);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "회원 정보를 불러오지 못했습니다.",
        );
      }
    }

    fetchMyInfo();
  }, []);

  // 내 정보 수정
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!nickname.trim()) {
      setMessage("닉네임을 입력해주세요.");
      return;
    }

    if (nickname.trim().length < 2 || nickname.trim().length > 12) {
      setMessage("닉네임은 2자 이상 12자 이하여야 합니다.");
      return;
    }

    if (nickname.trim() === myInfo?.nickname) {
      setMessage("변경된 닉네임이 없습니다.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await updateMyInfo({
        nickname: nickname.trim(),
      });

      setMyInfo(response.result);
      setNickname(response.result.nickname);

      // 로그인 시 저장한 닉네임도 최신 정보로 변경
      localStorage.setItem("nickname", response.result.nickname);

      setIsEditing(false);
      setMessage("회원 정보가 수정되었습니다.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "회원 정보 수정에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  // 날짜 표시
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f5f6f8] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {!myInfo ? (
          <p className="py-8 text-center text-gray-500">
            {message || "회원 정보를 불러오는 중입니다."}
          </p>
        ) : (
          <>
            {/* 내 정보 조회 */}
            {!isEditing && (
              <section>
                <div className="mb-7 flex items-center justify-between">
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    내 정보
                  </h1>

                  <button
                    type="button"
                    onClick={() => {
                      setNickname(myInfo.nickname);
                      setIsEditing(true);
                      setMessage("");
                    }}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    정보 수정
                  </button>
                </div>

                <div className="border-b border-gray-200 pb-5">
                  <h2 className="mb-4 text-sm font-bold text-gray-900">
                    기본 정보
                  </h2>

                  <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[100px_1fr_1fr]">
                    {/* 프로필 아이콘 */}
                    <div className="flex justify-center sm:justify-start">
                      <img
                        src="/icon/person.svg"
                        alt="프로필"
                        className="h-20 w-20 rounded-full"
                      />
                    </div>

                    {/* 닉네임 */}
                    <div>
                      <p className="mb-1 text-xs text-gray-400">닉네임</p>
                      <p className="text-sm font-bold text-gray-900">
                        {myInfo.nickname}
                      </p>
                    </div>

                    {/* 이메일 */}
                    <div>
                      <p className="mb-1 text-xs text-gray-400">이메일</p>
                      <p className="break-all text-sm font-bold text-gray-900">
                        {myInfo.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 가입일 */}
                <div className="mt-5">
                  <p className="mb-1 text-xs text-gray-400">가입일</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(myInfo.createdAt)}
                  </p>
                </div>

                {message && (
                  <p className="mt-4 text-sm text-gray-600" role="status">
                    {message}
                  </p>
                )}
              </section>
            )}

            {/* 내 정보 수정 */}
            {isEditing && (
              <form onSubmit={handleSubmit}>
                <div className="mb-7 flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                      내 정보 수정
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                      닉네임과 프로필 이미지만 변경할 수 있어요.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {isLoading ? "저장 중..." : "변경사항 저장"}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.5fr]">
                  {/* 왼쪽: 프로필 이미지 */}
                  <div className="flex flex-col items-center justify-center py-8">
                    <img
                      src="/icon/person.svg"
                      alt="프로필"
                      className="h-20 w-20 rounded-full"
                    />

                    <p className="mt-2 text-sm font-bold text-gray-900">
                      프로필 이미지
                    </p>
                  </div>

                  {/* 오른쪽: 닉네임 및 이메일 */}
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="nickname"
                        className="mb-2 block text-sm font-bold text-gray-900"
                      >
                        닉네임
                      </label>

                      <input
                        id="nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        maxLength={12}
                        required
                        placeholder="닉네임을 입력해주세요."
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-bold text-gray-900"
                      >
                        이메일
                      </label>

                      <input
                        id="email"
                        type="email"
                        value={myInfo.email}
                        disabled
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-4 text-sm text-gray-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {message && (
                  <p className="mt-5 text-sm text-gray-600" role="status">
                    {message}
                  </p>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setNickname(myInfo.nickname);
                      setIsEditing(false);
                      setMessage("");
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    취소
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </main>
  );
}
