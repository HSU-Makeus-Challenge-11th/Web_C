package com.umc.study.repository;

import com.umc.study.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findAllByOrderByBookIdDesc();
    List<Book> findByCategory_CategoryIdOrderByBookIdDesc(Long categoryId);
    // 선택) 도서 제목 검색
    List<Book> findByTitleContainingOrderByBookIdDesc(String keyword);
    // 선택 2) title 중복 검사
    boolean existsByTitle(String title);
}
