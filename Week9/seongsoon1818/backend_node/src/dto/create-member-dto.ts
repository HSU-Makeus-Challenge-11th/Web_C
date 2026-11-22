import {
  IsEmail,
  IsByteLength,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({ description: '로그인에 사용할 이메일', example: 'challenger@umc.com' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({
    description: '대문자/소문자/숫자/특수문자를 포함한 8자 이상',
    example: 'Umc1234!',
  })
  @IsString()
  @IsByteLength(0, 72, {
    message: '비밀번호는 UTF-8 기준 72바이트 이하여야 합니다.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
    message:
      '비밀번호는 대문자/소문자/숫자/특수문자를 포함한 8자 이상이어야 합니다.',
  })
  password: string;

  @ApiProperty({ description: '2자 이상 12자 이하의 닉네임', example: '영화조아' })
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @MinLength(2, { message: '닉네임은 2자 이상이어야 합니다.' })
  @MaxLength(12, { message: '닉네임은 12자 이하여야 합니다.' })
  nickname: string;
}
