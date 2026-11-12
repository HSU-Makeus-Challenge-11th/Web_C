// 우리 서버(NestJS)의 공통 응답 형식이에요.
interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

interface CheckResponse {
  available: boolean;
}

interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

interface SignupResult {
  memberId: number;
  email: string;
  nickname: string;
}

type SignupResponse = ApiResponse<SignupResult>;

export type {
  ApiResponse,
  CheckResponse,
  RatingResponse,
  SignupRequest,
  SignupResponse,
  SignupResult,
};
