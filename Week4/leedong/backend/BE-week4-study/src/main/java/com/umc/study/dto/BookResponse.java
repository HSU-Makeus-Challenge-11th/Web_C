package com.umc.study.dto;

import com.umc.study.entity.Book;
import lombok.Getter;

@Getter
public class BookResponse {

    private final Long bookId;
    private final String title;
    private final String description;
    private final String categoryName;
    private final Boolean isAvailable;

    public BookResponse(Book book) {
        this.bookId = book.getBookId();
        this.title = book.getTitle();
        this.description = book.getDescription();
        this.categoryName = book.getCategory().getName();
        this.isAvailable = book.getIsAvailable();
    }
}