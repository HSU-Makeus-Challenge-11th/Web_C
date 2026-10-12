package com.umc.study.exception;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(Long categoryId) {
        super("존재하지 않는 카테고리입니다. categoryId=" + categoryId);
    }
}