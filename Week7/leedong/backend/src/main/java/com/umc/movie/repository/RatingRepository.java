package com.umc.movie.repository;

import com.umc.movie.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByMember_MemberIdOrderByRatingIdDesc(Long memberId);

    // 언더스코어(_)는 "연관된 엔티티를 타고 들어가라"는 표시입니다.
    // rating.member.memberId 를 조건으로 삼겠다는 뜻이에요.
    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}
