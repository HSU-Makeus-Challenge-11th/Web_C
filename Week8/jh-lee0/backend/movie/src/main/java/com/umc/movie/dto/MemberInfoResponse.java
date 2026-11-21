// src/main/java/com/umc/movie/dto/MemberInfoResponse.java
package com.umc.movie.dto;

import com.umc.movie.entity.Member;

import java.time.LocalDateTime;

public record MemberInfoResponse(
        Long memberId,          // 8주차 추가: 프론트에서 GET /members/{memberId}/ratings 호출할 때 필요
        String email,
        String nickname,
        LocalDateTime createdAt
) {
    // 엔티티를 그대로 응답하면 password까지 나가버리므로 반드시 DTO로 옮겨 담습니다
    public static MemberInfoResponse from(Member member) {
        return new MemberInfoResponse(
                member.getMemberId(),   // 8주차 추가
                member.getEmail(),
                member.getNickname(),
                member.getCreatedAt()
        );
    }
}
