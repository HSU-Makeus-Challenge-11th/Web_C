package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

// 단위 테스트: 스프링도 DB도 띄우지 않고, Repository 자리에 가짜(Mock)를 끼워 RatingService의 판단만 확인합니다.
@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    @Test
    @DisplayName("이미 평점을 남긴 영화에 다시 평점을 등록하면 409와 RATING409_1 예외가 발생한다")
    void create_duplicateRating_throwsRating409() {
        // given: 1번 회원이 있고, 550번 영화에는 이미 평점을 남긴 상태
        Long memberId = 1L;
        Member member = Member.builder().email("tester@umc.com").password("encoded").nickname("tester").build();
        given(memberRepository.findById(memberId)).willReturn(Optional.of(member));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(memberId, 550L)).willReturn(true);
        CreateRatingRequest request = new CreateRatingRequest(550L, 5, "또 남겨봅니다");

        // when
        ApiException exception = assertThrows(ApiException.class,
                () -> ratingService.create(memberId, request));

        // then: 우리가 정한 상태 코드와 code가 나오고, 아무것도 저장되지 않았다
        assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(exception.getCode()).isEqualTo("RATING409_1");
        verify(ratingRepository, never()).save(any(Rating.class));
    }

    @Test
    @DisplayName("남의 평점을 수정하려고 하면 403과 RATING403_1 예외가 발생하고 값은 바뀌지 않는다")
    void update_otherMembersRating_throwsRating403() {
        // given: 평점의 주인은 2번 회원인데, 1번 회원이 수정하려는 상황
        Member owner = Member.builder().email("owner@umc.com").password("encoded").nickname("owner").build();
        ReflectionTestUtils.setField(owner, "memberId", 2L); // memberId는 DB가 만들어주는 값이라 직접 넣어줍니다
        Rating rating = Rating.builder().member(owner).movieId(550L).score(4).comment("원래 후기").build();
        given(ratingRepository.findById(10L)).willReturn(Optional.of(rating));
        UpdateRatingRequest request = new UpdateRatingRequest(1, "내가 마음대로 바꿈");

        // when
        ApiException exception = assertThrows(ApiException.class,
                () -> ratingService.update(1L, 10L, request));

        // then: 403과 code가 나오고, 평점은 그대로이며 저장도 일어나지 않았다
        assertThat(exception.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(exception.getCode()).isEqualTo("RATING403_1");
        assertThat(rating.getScore()).isEqualTo(4);
        assertThat(rating.getComment()).isEqualTo("원래 후기");
        verify(ratingRepository, never()).save(any(Rating.class));
    }
}
