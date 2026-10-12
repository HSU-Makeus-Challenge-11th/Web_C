package com.umc.study.repository;


import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
@RequiredArgsConstructor
public class RentalRepository {
    private final JdbcTemplate jdbcTemplate;

    public void save(Map<String, Object> body){
        //insert할 4개의 컬럼 지정
        String sql = "INSERT INTO rental (user_id, book_id, rented_at, due_at) " +
                "VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))"; //앞에 물음표 두개 즉 user_id, book_id는 자바에서 넘겨준 값이 안전하게 채워진다
        jdbcTemplate.update(sql, body.get("userId"), body.get("bookId"));
    }

    // 대여 가능한 책일 때만 false로 바꿈. 바뀐 행 수가 0이면 이미 대여중이거나 없는 책
    public int markUnavailable(Object bookId){
        String sql = "UPDATE book SET is_available = false WHERE book_id = ? AND is_available = true";
        return jdbcTemplate.update(sql, bookId);
    }

}
