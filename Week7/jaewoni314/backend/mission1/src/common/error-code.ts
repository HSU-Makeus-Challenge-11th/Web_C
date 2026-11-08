import { HttpStatus } from "@nestjs/common";

export interface ErrorCode {
  status: HttpStatus;
  code: string;
  message: string;
}

// 같은 409라도 이메일과 닉네임 중복을 다른 code로 구분해서, 화면이 어느 입력칸에 오류를 보여 줄지 알 수 있어요.
export const ErrorCodes = {
  MEMBER_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    code: "MEMBER4041",
    message: "존재하지 않는 유저입니다.",
  },
  MEMBER_EMAIL_DUPLICATED: {
    status: HttpStatus.CONFLICT,
    code: "MEMBER4091",
    message: "이미 사용 중인 이메일입니다.",
  },
  MEMBER_NICKNAME_DUPLICATED: {
    status: HttpStatus.CONFLICT,
    code: "MEMBER4092",
    message: "이미 사용 중인 닉네임입니다.",
  },
  RATING_FORBIDDEN: {
    status: HttpStatus.FORBIDDEN,
    code: "RATING4031",
    message: "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
  },
  RATING_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    code: "RATING4041",
    message: "존재하지 않는 평점입니다.",
  },
  RATING_DUPLICATED: {
    status: HttpStatus.CONFLICT,
    code: "RATING4091",
    message: "이미 이 영화에 평점을 남기셨습니다.",
  },
} satisfies Record<string, ErrorCode>;
