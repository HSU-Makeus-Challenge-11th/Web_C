import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

// class-validator는 여러 규칙이 함께 실패하면 아래쪽 데코레이터의 메시지를 먼저 담고, 전역 필터는 그 첫 번째 메시지만 응답해요.
// 그래서 값을 빼고 보냈을 때 가장 기본인 규칙의 메시지가 보이도록 기본 검사를 아래에 둬요.
export class CreateMemberDto {
  @MaxLength(254, { message: "이메일은 254자 이하여야 합니다." })
  @IsEmail({}, { message: "올바른 이메일 형식이 아닙니다." })
  email: string;

  // 비밀번호는 빠뜨렸을 때도 규칙 안내가 보이도록 형식 검사를 아래에 둬요.
  @IsString({ message: "비밀번호는 문자열이어야 합니다." })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
    message: "비밀번호는 대문자/소문자/숫자/특수문자를 포함한 8자 이상이어야 합니다.",
  })
  password: string;

  @MaxLength(12, { message: "닉네임은 12자 이하여야 합니다." })
  @MinLength(2, { message: "닉네임은 2자 이상이어야 합니다." })
  @IsString({ message: "닉네임은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "닉네임을 입력해주세요." })
  nickname: string;
}
