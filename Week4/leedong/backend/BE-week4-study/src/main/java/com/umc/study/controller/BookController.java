package com.umc.study.controller;

import com.umc.study.dto.BookResponse;
import com.umc.study.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.umc.study.dto.CreateBookRequest;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<BookResponse> getBooks() {
        return bookService.getAllBooks();
    }
    @PostMapping
    public ResponseEntity<BookResponse> createBook(@Valid @RequestBody CreateBookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookService.createBook(request));
    }
}