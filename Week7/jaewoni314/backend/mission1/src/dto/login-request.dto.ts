import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDto {
  @IsEmail({}, { message: "올바른 이메일 형식이 아닙니다." })
  @IsNotEmpty({ message: "이메일을 입력해주세요." })
  email: string;

  // 로그인에서는 비밀번호 규칙(대소문자/숫자/특수문자)까지 검사하지 않아요.
  // 규칙이 바뀌기 전에 가입한 회원이 로그인조차 못 하게 되기 때문이에요.
  @IsString({ message: "비밀번호는 문자열이어야 합니다." })
  @IsNotEmpty({ message: "비밀번호를 입력해주세요." })
  password: string;
}
