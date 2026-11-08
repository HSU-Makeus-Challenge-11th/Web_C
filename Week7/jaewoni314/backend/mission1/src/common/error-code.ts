import { HttpStatus } from "@nestjs/common";

export interface ErrorCode {
  status: HttpStatus;
  code: string;
  message: string;
}

// code는 {도메인}{HTTP 상태 코드}_{일련번호} 규칙으로 지어요.
// 같은 409라도 MEMBER409_1(닉네임)과 MEMBER409_2(이메일)처럼 이유가 code에 드러나서, 화면이 code만 보고 다음 동작을 정할 수 있어요.
export const ErrorCodes = {
  MEMBER_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    code: "MEMBER404_1",
    message: "해당 회원을 찾을 수 없습니다.",
  },
  MEMBER_NICKNAME_DUPLICATED: {
    status: HttpStatus.CONFLICT,
    code: "MEMBER409_1",
    message: "이미 사용 중인 닉네임입니다.",
  },
  // 워크북 표에는 없지만 회원가입의 이메일 중복도 같은 규칙으로 이어서 번호를 붙였어요.
  MEMBER_EMAIL_DUPLICATED: {
    status: HttpStatus.CONFLICT,
    code: "MEMBER409_2",
    message: "이미 사용 중인 이메일입니다.",
  },
  RATING_FORBIDDEN: {
    status: HttpStatus.FORBIDDEN,
    code: "RATING403_1",
    message: "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
  },
  RATING_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    code: "RATING404_1",
    message: "해당 평점을 찾을 수 없습니다.",
  },
  RATING_DUPLICATED: {
    status: HttpStatus.CONFLICT,
    code: "RATING409_1",
    message: "이미 이 영화에 평점을 남기셨습니다.",
  },
} satisfies Record<string, ErrorCode>;
