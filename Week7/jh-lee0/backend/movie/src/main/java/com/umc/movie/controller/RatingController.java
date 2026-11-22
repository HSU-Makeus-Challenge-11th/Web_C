package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.interceptor.AuthInterceptor; // 7주차 실습 5) 인터셉터가 담아둔 memberId 이름을 쓰기 위해 추가
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
// 7주차 실습 5) 클래스 레벨 @RequestMapping("/members") 제거 (평점 API가 /ratings로 나가야 함)
public class RatingController {
    private final RatingService ratingService;

    // 7주차 실습 5) 클래스 매핑이 없어졌으므로 전체 경로로 작성 (공개 API라 토큰 안 받음)
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(@PathVariable Long memberId) {
        return ratingService.getRatingsByMember(memberId);
    }

    // 7주차 실습 5) URL에서 memberId 제거: /{memberId}/ratings → /ratings
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create( // 7주차 실습 5) result 타입 Long → RatingResponse
                                                               @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId, // 7주차 실습 5) @PathVariable → 토큰에서 꺼낸 값
                                                               @Valid @RequestBody CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201).body(ApiResponse.created("평점 등록에 성공했습니다.", response));
    }

    // 7주차 실습 5) URL에서 memberId 제거: /{memberId}/ratings/{ratingId} → /ratings/{ratingId}
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update( // 7주차 실습 5) result 타입 Void → RatingResponse
                                                               @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId, // 7주차 실습 5) @PathVariable → 토큰에서 꺼낸 값
                                                               @PathVariable Long ratingId,
                                                               @Valid @RequestBody UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request); // 7주차 실습 5) 인자 순서 변경
        return ResponseEntity.ok(ApiResponse.ok("평점 수정에 성공했습니다.", response));
    }

    // 7주차 실습 5) URL에서 memberId 제거: /{memberId}/ratings/{ratingId} → /ratings/{ratingId}
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete( // 응답 204 No Content → 200 + 공통 응답 형식
                                                     @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId, // 7주차 실습 5) @PathVariable → 토큰에서 꺼낸 값
                                                     @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId); // 인자 순서 변경
        return ResponseEntity.ok(ApiResponse.ok("평점 삭제에 성공했습니다.", null)); // 7주차 실습 5) result는 null
    }
}
