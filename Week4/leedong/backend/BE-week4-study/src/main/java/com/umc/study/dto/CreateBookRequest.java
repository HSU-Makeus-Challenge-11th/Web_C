package com.umc.study.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CreateBookRequest {

    @NotNull(message = "categoryId는 필수입니다.")
    private Long categoryId;

    @NotBlank(message = "title은 비어 있을 수 없습니다.")
    @Size(max = 100, message = "title은 100자 이하여야 합니다.")
    private String title;

    private String description;
}