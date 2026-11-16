import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

// 로그인 토큰은 서버 데이터가 아니라 이 브라우저가 들고 있는 클라이언트 상태라서 Zustand에 둬요.
// 회원 정보(닉네임 등)는 서버가 원본이라 여기에 복사하지 않고 query 캐시(["members", "me"])에서 읽어요.
// persist로 localStorage에 저장해서 새로고침해도 로그인이 유지돼요.
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
      // 저장값은 개발자 도구에서 바뀔 수 있어서, 문자열이 아니면 로그인하지 않은 상태로 시작해요.
      merge: (persistedState, currentState) => {
        const accessToken = (persistedState as Partial<AuthStore> | undefined)?.accessToken;
        return { ...currentState, accessToken: typeof accessToken === "string" ? accessToken : null };
      },
    },
  ),
);

// 토큰 payload의 sub에는 회원 ID가 들어 있어요. (GET /members/me 응답에는 memberId가 없어요.)
// 서명 검증은 서버가 하므로 여기서는 화면에 쓸 값만 읽어요. 읽을 수 없으면 null이에요.
export function getMemberIdFromToken(accessToken: string | null): number | null {
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1] ?? "";
    // payload는 Base64URL이라 atob이 읽는 Base64로 바꾸고, 빠진 = 패딩을 채워요.
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const memberId = Number((JSON.parse(atob(padded)) as { sub?: unknown }).sub);
    return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
