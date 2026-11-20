import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../service/auth.service.js";
import { LoginRequestDto } from "../dto/login-request.dto.js";
import { ApiResponse } from "../common/api-response.js";
import { ErrorCodes } from "../common/error-code.js";
import { ApiFail, ApiSuccess } from "../swagger/api-docs.js";

// 공개 API라 자물쇠(ApiBearerAuth)를 붙이지 않아요. 여기서 받은 accessToken을 Swagger의 Authorize에 넣어요.
@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 동사(login)를 쓴 경로라 명사형 자원 경로 원칙에서 벗어난 예외예요.
  // 많은 서비스가 /login을 써서 프론트 개발자가 한눈에 알아보기 쉬워 이 이름을 그대로 썼어요.
  @Post("login")
  @HttpCode(HttpStatus.OK) // @Post의 기본 응답은 201이라 200으로 바꿔요.
  @ApiOperation({ summary: "로그인 (공개)", description: "토큰이 필요 없어요. 성공하면 accessToken을 돌려줘요." })
  @ApiSuccess(HttpStatus.OK, "COMMON200", "로그인에 성공했습니다.", { nickname: "영화광", accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  @ApiFail(HttpStatus.UNAUTHORIZED, ErrorCodes.AUTH_LOGIN_FAILED)
  async login(@Body() dto: LoginRequestDto) {
    const result = await this.authService.login(dto);
    return ApiResponse.success("COMMON200", "로그인에 성공했습니다.", result);
  }
}
