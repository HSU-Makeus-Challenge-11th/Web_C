// src/main/java/.../controller/BookController.java
package com.umc.study.controller;

import com.umc.study.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

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
    // POST http://localhost:8080/books
    @PostMapping
    public String createBook(@RequestBody Map<String, Object> body){
        bookService.createBook(body);
        return "도서 등록이 완료되었습니다!";
    }
    //클래스 위에 이미 /books가 있으니 최종수소는 /books/category/{categoryId}가 됨 여기서 categoryId에 실제 값이 들어 온다
    @GetMapping("/category/{categoryId}")
    //아까 중괄호 자리에 실제로 들어온 값을 꺼내서 categoryId라는 변수에 담아주는 역할
    public List<Map<String, Object>> getBooksByCategoryId(@PathVariable Long categoryId){
        return bookService.getBooksByCategoryId(categoryId);
    }
}