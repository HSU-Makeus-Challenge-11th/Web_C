import { authApi } from "../auth-api";
import type { ApiResponse, RatingResponse } from "../members/models";

interface CreateRatingRequest {
  movieId: number;
  // 1~5 정수
  score: number;
  // 선택, 500자 이하
  comment?: string;
}

interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  // PATCH지만 전체 교체라서, 빼고 보내면 기존 후기가 지워져요(null).
  comment?: string;
}

// 평점 등록/수정/삭제는 로그인이 필요해서 authApi로 요청해요. 작성자는 서버가 토큰으로 알아내요.
// 평점 조회(GET /members/{memberId}/ratings)는 공개 API라 api/members/get-member-ratings.ts에 있어요.

// POST /ratings: 같은 영화에 이미 평점이 있으면 409(RATING409_1)
async function createRating(body: CreateRatingRequest) {
  const response = await authApi.post("ratings", { json: body }).json<ApiResponse<RatingResponse>>();
  return response.result;
}

// PATCH /ratings/{ratingId}: 내 평점이 아니면 403(RATING403_1)
async function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  const response = await authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<ApiResponse<RatingResponse>>();
  return response.result;
}

// DELETE /ratings/{ratingId}: 성공하면 200과 result: null
async function deleteRating(ratingId: number) {
  await authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}

export { createRating, deleteRating, updateRating };
export type { CreateRatingRequest, UpdateRatingRequest };
