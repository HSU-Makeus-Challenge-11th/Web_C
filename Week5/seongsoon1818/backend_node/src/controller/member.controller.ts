import { Controller, Get, Param } from "@nestjs/common";
import { MemberService } from "../service/member.service";
import { EmailParamsDto, NicknameParamsDto } from "../dto/member-check-params.dto";

@Controller("members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get("nickname/:nickname")
  checkNickname(@Param() { nickname }: NicknameParamsDto) {
    return this.memberService.checkNickname(nickname);
  }

  @Get("email/:email")
  checkEmail(@Param() { email }: EmailParamsDto) {
    return this.memberService.checkEmail(email);
  }
}
