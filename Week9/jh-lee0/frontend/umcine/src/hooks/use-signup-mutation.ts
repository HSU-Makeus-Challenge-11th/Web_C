import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/members/signup";
// import { useRouter } from "next/navigation";

// 훅을 안에서 쓰는 함수는 use로 시작
// 회원가입용 useMutation을 반환하는 함수
export function useSignupMutation() {
  // const router = useRouter();

  return useMutation({ // useMutation에 설정 객체 {}를 넣어서 호출한 결과를 return
    mutationFn: signup, // 보낼 요청은 signup 함수
    onSuccess: (response) => { // 성공하면 이 함수를 실행
      alert(response.message);

      // 로그인 페이지 연결 후 주석 해제
      // router.push("/login");
    },
    onError: () => { // 실패하면 이 함수를 실행
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}