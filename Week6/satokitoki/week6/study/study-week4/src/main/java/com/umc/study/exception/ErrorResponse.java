package com.umc.study.exception;

public record ErrorResponse(
        int status,
        String message
) {}