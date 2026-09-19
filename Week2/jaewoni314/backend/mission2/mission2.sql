USE book_rental;

-- 미션 2. 특정 사용자(user_id = 1)가 아직 반납하지 않은 책을 반납 예정일 순으로 조회
-- 결과: 책 제목, 대여일, 반납 예정일
--
-- 기준 테이블: "누가 언제 빌렸는지"는 대여 기록이므로 rental을 기준으로 시작합니다.
-- JOIN 이유: 책 제목은 rental이 아닌 book 테이블에 있으므로,
--           rental.book_id(FK) → book.book_id(PK) 관계를 따라 JOIN합니다.
-- WHERE 조건: 현재 로그인한 사용자(user_id = 1)의 대여 중 returned_at이 NULL인 것만 남깁니다.
--           NULL은 = 로 비교할 수 없으므로 IS NULL을 사용합니다.
-- 정렬: 반납 예정일(due_at)이 빠른 순서로 정렬하고, 같으면 rental_id로 보조 정렬합니다.
SELECT b.title, r.rented_at, r.due_at
FROM rental r
JOIN book b ON r.book_id = b.book_id
WHERE r.user_id = 1
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC, r.rental_id ASC;
