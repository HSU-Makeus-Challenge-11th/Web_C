import { apiClient } from "../api-client";
import { authApi } from "../auth-api";

// 미션 7: 평점 API 함수 모음

// 평점 하나의 모양 (백엔드 RatingResponse와 같음)
export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// 등록·수정 응답 (공통 형식 + result에 평점 하나)
interface RatingResultResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}

// 삭제 응답 (result는 null)
interface RatingDeleteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

// 등록할 때 보낼 값
export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

// 수정할 때 보낼 값
export interface UpdateRatingRequest {
  score: number;
  comment: string;
}

// GET /members/{memberId}/ratings — 이 회원의 평점 전부
// 공개 API라 apiClient 사용, 이 API만 공통 형식 없이 배열을 그대로 돌려줌
export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

// POST /ratings — 평점 등록 (로그인 필요 → authApi)
export function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<RatingResultResponse>();
}

// PATCH /ratings/{ratingId} — 평점 수정
export function updateRating(ratingId: number, body: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<RatingResultResponse>();
}

// DELETE /ratings/{ratingId} — 평점 삭제
export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<RatingDeleteResponse>();
}