package com.umc.movie.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// 통합 테스트: 진짜 HTTP 요청처럼 보내서 인터셉터(인증) -> 컨트롤러 -> 서비스 -> DB(H2)까지 전부 실제로 돕니다.
// @Transactional 덕분에 테스트가 끝나면 저장한 데이터가 롤백되어 다음 테스트에 영향을 주지 않습니다.
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RatingApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    @DisplayName("토큰 없이 평점을 등록하면 401과 AUTH401_2를 돌려준다")
    void createRating_withoutToken_returns401() throws Exception {
        mockMvc.perform(post("/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ratingBody(550L, 5, "토큰 없이 보냅니다")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    @DisplayName("토큰을 담아 평점을 등록하면 201과 저장된 평점을 돌려준다")
    void createRating_withToken_returns201() throws Exception {
        Member member = saveMember("rater@umc.com", "rater");

        mockMvc.perform(post("/ratings")
                        .header(HttpHeaders.AUTHORIZATION, bearer(member))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ratingBody(550L, 5, "정말 재미있어요")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550))
                .andExpect(jsonPath("$.result.score").value(5));
    }

    private String ratingBody(Long movieId, Integer score, String comment) throws Exception {
        return objectMapper.writeValueAsString(Map.of("movieId", movieId, "score", score, "comment", comment));
    }

    private Member saveMember(String email, String nickname) {
        return memberRepository.save(Member.builder()
                .email(email)
                .password("encoded-password")
                .nickname(nickname)
                .build());
    }

    private String bearer(Member member) {
        return "Bearer " + jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
    }
}
