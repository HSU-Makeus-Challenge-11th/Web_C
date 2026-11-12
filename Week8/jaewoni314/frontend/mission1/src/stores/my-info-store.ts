import { create } from "zustand";

interface MyInfo {
  email: string;
  nickname: string;
  // 가입일 (YYYY-MM-DD)
  joinedAt: string;
}

interface MyInfoStore {
  myInfo: MyInfo;
  updateNickname: (nickname: string) => void;
}

// 8주차에 내 정보 조회, 수정 API를 연결하기 전까지 화면을 확인하려고 쓰는 예시 회원 정보예요.
// 서버의 더미 데이터(1번 회원)와 같은 값이에요. localStorage에 저장하지 않아서 새로고침하면 처음 값으로 돌아가요.
const EXAMPLE_MY_INFO: MyInfo = {
  email: "noco@umc.com",
  nickname: "수현",
  joinedAt: "2026-09-13",
};

export const useMyInfoStore = create<MyInfoStore>()((set) => ({
  myInfo: EXAMPLE_MY_INFO,
  updateNickname: (nickname) =>
    set((state) => ({ myInfo: { ...state.myInfo, nickname } })),
}));
