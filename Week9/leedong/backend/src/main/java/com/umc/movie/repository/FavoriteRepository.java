// src/main/java/com/umc/movie/repository/FavoriteRepository.java
package com.umc.movie.repository;

import com.umc.movie.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // 내 즐겨찾기를 최신 등록 순으로 조회
    List<Favorite> findByMember_MemberIdOrderByFavoriteIdDesc(Long memberId);

    // 해제할 때 "내 것 중에서 이 영화"를 찾는 용도
    Optional<Favorite> findByMember_MemberIdAndMovieId(Long memberId, Long movieId);

    // 이미 즐겨찾기했는지 확인하는 용도
    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}
