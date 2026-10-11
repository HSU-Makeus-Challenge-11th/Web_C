// src/main/java/.../repository/BookRepository.java
package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository // 스프링 컨테이너에 "나 창고지기 부품이야!"라고 등록
@RequiredArgsConstructor
public class BookRepository {

    // 2단계에서 준비된 스프링의 DB 통신 도구(JdbcTemplate) 주입
    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> findAll() {//조건 없이 book테이블 전체를 가져오는 메서드(where절이 없음)
        String sql = "SELECT * FROM book";

        // 쿼리를 실행하고 결과를 List<Map> 형태의 날것 데이터로 긁어옵니다.
        // Map의 Key는 '컬럼명(title)', Value는 '실제 데이터(달빛 도서관)'가 됩니다.
        return jdbcTemplate.queryForList(sql);
    }
    public void save(Map<String, Object> body){
        // book_id는 AUTO_INCREMENT이므로 생략, is_available은 기본 true로 삽입
        String sql = "INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)";

        // SQL 뒤에 파라미터를 차례대로 넘겨주면 ? 자리에 순서대로 안전하게 바인딩됩니다.
        jdbcTemplate.update(
                sql,
                body.get("categoryId"),
                body.get("title"),
                body.get("description")
        );
    }
    //findAll이랑 거의 비슷한데 WHERE category_id = ?만 추가 시킴 물음표는 파라미터 바인딩
    //findAll은 book테이블 전체를 가져오는데 이 메서드는 where절로 category로 필터링을 해줌
    public List<Map<String, Object>> findByCategoryId(Long categoryId){ // Long으로 한 이유는 DB에서 vategoryId 컬럼이 BIGINT면 자바로 치면 Lond에 대응하기 때문
        String sql = "SELECT * FROM book WHERE category_id = ?";
        return jdbcTemplate.queryForList(sql, categoryId); //두번째 인자로 categoryId를 넘기면 물음표 자리에 값이 안전하게 들어오게 해준다
    }
}