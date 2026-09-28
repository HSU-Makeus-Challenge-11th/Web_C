// src/main/java/.../controller/BookController.java
package com.umc.backend_spring.controller;

import com.umc.backend_spring.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

// BookController.java에 추가
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController // 1. "나는 데이터를 JSON으로 서빙하는 API 카운터야!"
@RequestMapping("/books") // 2. 이 컨트롤러로 들어오는 요청의 기본 주소는 /books
@RequiredArgsConstructor
public class BookController {

    // 주방장(Service)을 주입받아 카운터 옆에 대기시킵니다.
    private final BookService bookService;

    // 3. HTTP GET 방식으로 /books 요청이 들어왔을 때 이 메서드가 실행됩니다.
    @GetMapping
    public List<Map<String, Object>> getBooks() {
        return bookService.getAllBooks();
    }

    // GET http://localhost:8080/books/category/1
    @GetMapping("/category/{categoryId}")
    public List<Map<String, Object>> getBooksByCategory(@PathVariable Long categoryId) {
        return bookService.getBooksByCategory(categoryId);
    }

    // POST http://localhost:8080/books
    @PostMapping
    public String createBook(@RequestBody Map<String, Object> body){
        bookService.createBook(body);
        return "도서 등록이 완료되었습니다!";
    }
}
