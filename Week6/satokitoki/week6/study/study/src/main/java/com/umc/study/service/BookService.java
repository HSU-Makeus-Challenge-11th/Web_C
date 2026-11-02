package com.umc.study.service;

import com.umc.study.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    // 실습 1: 도서 전체 조회
    public List<Map<String, Object>> getAllBooks() {
        return bookRepository.findAll();
    }

    // 실습 2: 도서 등록
    public void createBook(Map<String, Object> body) {
        bookRepository.save(body);
    }

    // 미션 1: 특정 카테고리의 도서 목록 조회
    public List<Map<String, Object>> getBooksByCategory(Long categoryId) {
        return bookRepository.findByCategoryId(categoryId);
    }
}