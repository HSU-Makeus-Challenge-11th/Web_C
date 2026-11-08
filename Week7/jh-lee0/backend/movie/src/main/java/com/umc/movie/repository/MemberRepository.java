// src/main/java/com/umc/movie/repository/MemberRepository.java
package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);
    Optional<Member> findByEmail(String email);
    // 7주차 - 닉네임 중복 확인 >> 나 자신을 제외하고, 이 닉네임을 사용하는 회원이 또 있는지 검사
    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);
}
