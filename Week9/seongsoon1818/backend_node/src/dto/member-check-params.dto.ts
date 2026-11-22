import { IsEmail, IsString, Length } from 'class-validator';

export class NicknameParamsDto {
  @IsString()
  @Length(2, 12, { message: '닉네임은 2~12자여야 합니다.' })
  nickname: string;
}

export class EmailParamsDto {
  @IsEmail({}, { message: '올바른 이메일 형식이어야 합니다.' })
  email: string;
}
