package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.interceptor.AuthInterceptor; // 7주차 실습 5) 인터셉터가 담아둔 memberId 이름을 쓰기 위해 추가
import com.umc.movie.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
// 7주차 실습 5) 클래스 레벨 @RequestMapping("/members") 제거 (평점 API가 /ratings로 나가야 함)
@Tag(name = "평점", description = "영화 평점 등록/수정/삭제와 유저별 평점 조회 API")
// 9주차 미션) 유저별 평점 조회는 공개 API라 @SecurityRequirement를 클래스가 아닌 메서드마다 붙입니다
public class RatingController {
    private final RatingService ratingService;

    @Operation(
            summary = "유저별 평점 조회",
            description = "회원 ID로 그 회원이 남긴 평점 목록을 최신순으로 조회합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "평점 목록 조회 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            [
                              { "ratingId": 1, "movieId": 550, "score": 5, "comment": "인생 영화입니다.", "createdAt": "2026-09-13T21:00:00", "updatedAt": "2026-09-13T21:00:00" }
                            ]
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "존재하지 않는 회원",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "MEMBER404_1",
                              "message": "해당 회원을 찾을 수 없습니다.",
                              "result": null
                            }
                            """)))
    })
    // 7주차 실습 5) 클래스 매핑이 없어졌으므로 전체 경로로 작성 (공개 API라 토큰 안 받음)
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(@PathVariable Long memberId) {
        return ratingService.getRatingsByMember(memberId);
    }

    @Operation(
            summary = "평점 등록",
            description = "토큰의 주인인 회원이 TMDB 영화 하나에 별점(1~5)과 후기를 남깁니다. 같은 영화에는 한 번만 남길 수 있습니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "평점 등록 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON201",
                              "message": "평점 등록에 성공했습니다.",
                              "result": { "ratingId": 1, "movieId": 550, "score": 5, "comment": "인생 영화입니다.", "createdAt": "2026-09-13T21:00:00", "updatedAt": "2026-09-13T21:00:00" }
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_2",
                              "message": "로그인이 필요한 요청입니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 평점을 남긴 영화",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "RATING409_1",
                              "message": "이미 이 영화에 평점을 남기셨습니다.",
                              "result": null
                            }
                            """)))
    })
    // 7주차 실습 5) URL에서 memberId 제거: /{memberId}/ratings → /ratings
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create( // 7주차 실습 5) result 타입 Long → RatingResponse
                                                               @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId, // 7주차 실습 5) @PathVariable → 토큰에서 꺼낸 값
                                                               @Valid @RequestBody CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201).body(ApiResponse.created("평점 등록에 성공했습니다.", response));
    }

    @Operation(
            summary = "평점 수정",
            description = "내가 남긴 평점의 별점과 후기를 수정합니다. 다른 회원의 평점은 수정할 수 없습니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "평점 수정 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON200",
                              "message": "평점 수정에 성공했습니다.",
                              "result": { "ratingId": 1, "movieId": 550, "score": 4, "comment": "다시 보니 조금 아쉽네요.", "createdAt": "2026-09-13T21:00:00", "updatedAt": "2026-09-14T10:00:00" }
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_2",
                              "message": "로그인이 필요한 요청입니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", description = "다른 회원의 평점",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "RATING403_1",
                              "message": "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "존재하지 않는 평점",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "RATING404_1",
                              "message": "해당 평점을 찾을 수 없습니다.",
                              "result": null
                            }
                            """)))
    })
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

    @Operation(
            summary = "평점 삭제",
            description = "내가 남긴 평점을 삭제합니다. 다른 회원의 평점은 삭제할 수 없습니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "평점 삭제 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON200",
                              "message": "평점 삭제에 성공했습니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_2",
                              "message": "로그인이 필요한 요청입니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", description = "다른 회원의 평점",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "RATING403_1",
                              "message": "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "존재하지 않는 평점",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "RATING404_1",
                              "message": "해당 평점을 찾을 수 없습니다.",
                              "result": null
                            }
                            """)))
    })
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
