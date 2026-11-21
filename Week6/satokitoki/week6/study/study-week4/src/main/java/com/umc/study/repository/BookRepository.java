package com.umc.study.repository;

import com.umc.study.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // book_id 내림차순(최신순)으로 전체 조회
    List<Book> findAllByOrderByBookIdDesc();
}