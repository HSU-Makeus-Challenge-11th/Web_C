package com.umc.study.dto;

import com.umc.study.domain.Book;

// record : 모든 필드를 private final로 바꾸고 Getter와 생성자를 자동으로 생성
public record BookResponse(
        Long bookId,
        String title,
        String description,
        String categoryName, // Category 객체를 String으로 변환하여 전달(DTO의 핵심)
        Boolean isAvailable
)

{ // from은 정적 팩토리 메서드, DB에서 조회해온 Book 엔티티 객체를 매개변수로 받아 BookResponse로 변환하는 역할
    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getBookId(),
                book.getTitle(),
                book.getDescription(),
                book.getCategory().getName(),
                book.getIsAvailable()
        );
    }
}
