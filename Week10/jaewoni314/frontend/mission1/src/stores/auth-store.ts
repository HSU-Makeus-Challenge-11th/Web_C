import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  // localStorage에서 토큰을 읽어 왔는지예요. 읽기 전에는 토큰이 없어도 "로그아웃 상태"라고 단정하지 않아요.
  hasHydrated: boolean;
  // 사용자가 직접 로그아웃해서 토큰이 사라졌는지예요. 로그인 전용 Layout이 로그인 화면이 아니라 홈으로 보낼 때 써요.
  signedOut: boolean;
  setAccessToken: (accessToken: string | null) => void;
  signOut: () => void;
}

// 로그인 토큰은 서버 데이터가 아니라 이 브라우저가 들고 있는 클라이언트 상태라서 Zustand에 둬요.
// 회원 정보(닉네임 등)는 서버가 원본이라 여기에 복사하지 않고 query 캐시(["members", "me"])에서 읽어요.
// persist로 localStorage에 저장해서 새로고침해도 로그인이 유지돼요.
//
// Next.js는 Client Component도 서버에서 먼저 HTML로 그려요. 서버에는 localStorage가 없어서 서버 HTML은 항상 "로그아웃" 화면이에요.
// 브라우저가 store를 만들자마자 localStorage를 읽으면 첫 화면이 "로그인" 상태가 되어 서버 HTML과 달라지고(hydration mismatch),
// 그래서 skipHydration으로 자동 읽기를 끄고, 하이드레이션이 끝난 뒤 AuthHydrator(useEffect)에서 rehydrate()로 읽어요.
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      hasHydrated: false,
      signedOut: false,
      setAccessToken: (accessToken) => set({ accessToken, signedOut: false }),
      signOut: () => set({ accessToken: null, signedOut: true }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ accessToken: state.accessToken }),
      // 저장값은 개발자 도구에서 바뀔 수 있어서, 문자열이 아니면 로그인하지 않은 상태로 시작해요.
      merge: (persistedState, currentState) => {
        const accessToken = (persistedState as Partial<AuthStore> | undefined)?.accessToken;
        return { ...currentState, accessToken: typeof accessToken === "string" ? accessToken : null };
      },
      // 저장값이 없거나 읽지 못했어도 "읽기는 끝났다"고 표시해야 로그인 전용 페이지가 로그인 화면으로 보낼 수 있어요.
      onRehydrateStorage: () => () => useAuthStore.setState({ hasHydrated: true }),
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
