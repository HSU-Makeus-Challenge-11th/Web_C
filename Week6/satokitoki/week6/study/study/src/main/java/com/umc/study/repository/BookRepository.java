package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class BookRepository {

    private final JdbcTemplate jdbcTemplate;

    // 실습 1: 도서 전체 조회
    public List<Map<String, Object>> findAll() {
        String sql = "SELECT * FROM book";
        return jdbcTemplate.queryForList(sql);
    }

    // 실습 2: 도서 등록
    public void save(Map<String, Object> body) {
        // book_id는 AUTO_INCREMENT라 생략, is_available은 기본 true로 삽입
        String sql = "INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)";
        jdbcTemplate.update(
                sql,
                body.get("categoryId"),
                body.get("title"),
                body.get("description")
        );
    }

    // 미션 1: 특정 카테고리의 도서 목록 조회
    public List<Map<String, Object>> findByCategoryId(Long categoryId) {
        String sql = "SELECT * FROM book WHERE category_id = ?";
        return jdbcTemplate.queryForList(sql, categoryId);
    }
}