// 성공과 실패를 같은 모양으로 응답해서, 화면이 code와 message만 보고 결과를 처리할 수 있게 해요.
export class ApiResponse<T> {
  constructor(
    readonly isSuccess: boolean,
    readonly code: string,
    readonly message: string,
    readonly result: T,
  ) {}

  static success<T>(code: string, message: string, result: T): ApiResponse<T> {
    return new ApiResponse(true, code, message, result);
  }

  static fail(code: string, message: string): ApiResponse<null> {
    return new ApiResponse(false, code, message, null);
  }
}
