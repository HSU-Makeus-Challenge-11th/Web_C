import { HttpStatus } from "@nestjs/common";

export interface ErrorCode {
  status: HttpStatus;
  code: string;
  message: string;
}

// code는 {도메인}{HTTP 상태 코드}_{일련번호} 규칙으로 지어요.
// 같은 401이라도 AUTH401_2(토큰 없음)와 AUTH401_4(토큰 만료)처럼 이유가 code에 드러나서, 화면이 code만 보고 다음 동작을 정할 수 있어요.
export const ErrorCodes = {
  AUTH_LOGIN_FAILED: {
    status: HttpStatus.UNAUTHORIZED,
    code: "AUTH401_1",
    message: "이메일 또는 비밀번호가 올바르지 않습니다.",
  },
  AUTH_TOKEN_MISSING: {
    status: HttpStatus.UNAUTHORIZED,
    code: "AUTH401_2",
    message: "로그인이 필요한 요청입니다.",
  },
  AUTH_TOKEN_INVALID: {
    status: HttpStatus.UNAUTHORIZED,
    code: "AUTH401_3",
    message: "유효하지 않은 토큰입니다.",
  },
  AUTH_TOKEN_EXPIRED: {
    status: HttpStatus.UNAUTHORIZED,
    code: "AUTH401_4",
    message: "토큰이 만료되었습니다. 다시 로그인해주세요.",
  },
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
  FAVORITE_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    code: "FAVORITE404_1",
    message: "즐겨찾기한 영화를 찾을 수 없습니다.",
  },
  FAVORITE_DUPLICATED: {
    status: HttpStatus.CONFLICT,
    code: "FAVORITE409_1",
    message: "이미 이 영화를 즐겨찾기하셨습니다.",
  },
} satisfies Record<string, ErrorCode>;
