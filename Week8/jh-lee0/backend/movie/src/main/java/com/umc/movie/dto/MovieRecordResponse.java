// src/main/java/com/umc/movie/dto/MovieRecordResponse.java
package com.umc.movie.dto;

public record MovieRecordResponse(
        RatingResponse rating,
        FavoriteResponse favorite
) {
}
