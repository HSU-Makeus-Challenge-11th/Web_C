package com.umc.backend_spring.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Objects;

@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public Long save(Long userId, Long bookId) {
        String sql = """
                INSERT INTO rental (user_id, book_id, rented_at, due_at)
                VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
                """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setLong(1, userId);
            statement.setLong(2, bookId);
            return statement;
        }, keyHolder);

        // 생성된 id를 API의 rentalId로 반환하여 Postman에서 반납 요청에 사용할 수 있습니다.
        return Objects.requireNonNull(keyHolder.getKey(), "대여 기록 ID를 가져오지 못했습니다.").longValue();
    }

    public int returnRental(Long rentalId) {
        String sql = "UPDATE rental SET returned_at = NOW() WHERE id = ?";
        return jdbcTemplate.update(sql, rentalId);
    }
}
