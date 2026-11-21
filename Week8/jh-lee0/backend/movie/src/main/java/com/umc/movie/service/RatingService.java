package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException; // 7주차 실습 5) ResponseStatusException 대신 ApiException 사용
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    // 유저별 평점 조회
    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            // 7주차 실습 5) 예외를 ApiException으로 교체 (MEMBER404_1)
            throw new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1", "해당 회원을 찾을 수 없습니다.");
        }

        return ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId).stream()
                .map(RatingResponse::from)
                .toList();
    }

    // 6주차) 평점 등록
    // 7주차 실습 5) memberId는 토큰에서 꺼낸 값, 반환 타입 Long → RatingResponse
    @Transactional
    public RatingResponse create(Long memberId, CreateRatingRequest request) {
        Member member = memberRepository.findById(memberId)
                // 7주차 실습 5) 예외를 ApiException으로 교체 (MEMBER404_1)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1", "해당 회원을 찾을 수 없습니다."));

        // rating 테이블에는 (member_id, movie_id) 복합 UNIQUE 제약이 걸려 있음
        // 그냥 저장해도 DB가 막아주지만 사용자에게 안내 메시지를 보내기 위해 먼저 검사함
        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            // 7주차 실습 5) IllegalArgumentException → ApiException (RATING409_1)
            throw new ApiException(HttpStatus.CONFLICT, "RATING409_1", "이미 이 영화에 평점을 남기셨습니다.");
        }

        Rating rating = Rating.builder()
                .member(member)
                .movieId(request.movieId())
                .score(request.score())
                .comment(request.comment())
                .build();

        // 7주차 실습 5) ratingId 숫자 대신 RatingResponse 전체를 반환
        return RatingResponse.from(ratingRepository.save(rating));
    }

    // 평점 수정
    // 7주차 실습 5) 인자 순서 (ratingId, memberId) → (memberId, ratingId), 반환 타입 void → RatingResponse
    @Transactional
    public RatingResponse update(Long memberId, Long ratingId, UpdateRatingRequest request) {
        Rating rating = findOwnedRating(memberId, ratingId);

        rating.update(request.score(), request.comment());
        ratingRepository.save(rating);

        return RatingResponse.from(rating); // 7주차 실습 5) 수정 결과를 응답으로 돌려줌
    }

    // 평점 삭제
    // 7주차 실습 5) 인자 순서 (ratingId, memberId) → (memberId, ratingId)
    @Transactional
    public void delete(Long memberId, Long ratingId) {
        Rating rating = findOwnedRating(memberId, ratingId);

        ratingRepository.delete(rating);
    }

    // 평점을 찾고 해당 평점이 요청자가 작성한 것인지 확인
    // 7주차 실습 5) 인자 순서를 변경 (ratingId, memberId) → (memberId, ratingId)
    private Rating findOwnedRating(Long memberId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                // 예외를 ApiException으로 교체 (RATING404_1)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "RATING404_1", "해당 평점을 찾을 수 없습니다."));

        if (!rating.getMember().getMemberId().equals(memberId)) {
            // 예외를 ApiException으로 교체 (RATING403_1)
            throw new ApiException(HttpStatus.FORBIDDEN, "RATING403_1", "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.");
        }

        return rating;
    }
}
