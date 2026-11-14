// src/main/java/com/umc/movie/dto/LoginResponse.java
package com.umc.movie.dto;

public record LoginResponse(
        String nickname,
        String accessToken
) {
}
