import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

// 회원가입의 닉네임 규칙(2자 이상 12자 이하)과 메시지를 그대로 써요.
// class-validator는 여러 규칙이 함께 실패하면 아래쪽 데코레이터의 메시지를 먼저 담아요.
// 그래서 닉네임을 아예 빼고 보냈을 때 "입력해주세요"가 먼저 보이도록 기본 검사를 아래에 뒀어요.
export class MemberUpdateRequestDto {
  // 회원가입과 같이 앞뒤 공백을 지운 뒤 검사해서, 공백만 보낸 닉네임은 "입력해주세요"로 막아요.
  @Transform(({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value))
  @MaxLength(12, { message: "닉네임은 12자 이하여야 합니다." })
  @MinLength(2, { message: "닉네임은 2자 이상이어야 합니다." })
  @IsString({ message: "닉네임은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "닉네임을 입력해주세요." })
  nickname: string;
}
