USE book_rental;

-- 미션 3. 특정 책(book_id = 1)의 태그 목록과 특정 사용자(user_id = 1)의 좋아요 여부 조회
-- 결과: 책 제목, 태그 이름, 좋아요 여부
--
-- 기준 테이블: 책 상세 화면이므로 선택한 책 한 권, book을 기준으로 시작합니다.
-- JOIN 이유: book과 tag는 N:M 관계라 중간 테이블 book_tag를 거쳐 tag까지 JOIN합니다.
--           좋아요는 users N:M book 관계의 book_like에 있으므로 book_id와 user_id로 연결합니다.
--           태그나 좋아요가 없어도 책 정보는 나와야 하므로 LEFT JOIN을 사용하고,
--           좋아요는 user_id 조건을 ON에 넣어 "해당 사용자의 좋아요"만 붙입니다.
-- WHERE 조건: 선택한 책(book_id = 1)만 조회합니다.
-- 정렬: 태그 목록은 tag_id 순으로 정렬해 항상 같은 순서로 보여 줍니다.
SELECT
  b.title,
  t.name AS tag_name,
  bl.user_id IS NOT NULL AS is_liked
FROM book b
LEFT JOIN book_tag bt ON b.book_id = bt.book_id
LEFT JOIN tag t ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl ON b.book_id = bl.book_id
                      AND bl.user_id = 1
WHERE b.book_id = 1
ORDER BY t.tag_id;
