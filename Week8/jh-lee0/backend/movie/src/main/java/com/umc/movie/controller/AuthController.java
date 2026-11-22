// src/main/java/com/umc/movie/controller/AuthController.java
package com.umc.movie.controller;

import com.umc.movie.dto.LoginRequest;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.LoginResponse;
import com.umc.movie.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // http 요청을 받는 컨트롤러 임을 알림
@RequestMapping("/auth") // 이 클래스 안 모든 API 주소 앞에 /auth 를 공통으로 붙임
@RequiredArgsConstructor // final 필드를 받는 생성자를 자동 생성 → Spring이 이 생성자로 authService를 주입
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login( // HTTP 응답 전체(ResponseEntity...), 공통 응답 형식 DTO(ApiResponse...), result안에 들어갈 실제 데이터(LoginResponse)
            @RequestBody @Valid LoginRequest request
    ) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("로그인에 성공했습니다.", response));
    }
}
