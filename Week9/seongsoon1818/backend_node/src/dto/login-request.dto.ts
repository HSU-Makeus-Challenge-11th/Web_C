import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({ description: '가입할 때 사용한 이메일', example: 'challenger@umc.com' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  // 로그인 단계에서는 비밀번호 규칙(대소문자/숫자/특수문자)까지 검사하지 않습니다.
  // 규칙이 바뀌기 전에 가입한 회원이 로그인조차 못 하게 되기 때문입니다.
  @ApiProperty({ description: '가입할 때 사용한 비밀번호', example: 'Umc1234!' })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
