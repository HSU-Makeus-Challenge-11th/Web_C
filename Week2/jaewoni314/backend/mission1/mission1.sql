USE book_rental;

-- 미션 1. 문학 카테고리의 대여 가능한 도서를 최신순으로 10개 조회
-- 결과: 책 제목, 설명, 카테고리 이름
--
-- 기준 테이블: 화면에 보여 줄 대상이 도서이므로 book을 기준으로 시작합니다.
-- JOIN 이유: 카테고리 이름은 book이 아닌 category 테이블에 있으므로,
--           book.category_id(FK) → category.category_id(PK) 관계(category 1:N book)를 따라 JOIN합니다.
-- WHERE 조건: 카테고리 이름이 '문학'이고 대여 가능(is_available = TRUE)한 책만 남깁니다.
-- 정렬·범위: 최신순은 book_id 내림차순으로 정렬하고, LIMIT 10으로 10개만 가져옵니다.
SELECT b.title, b.description, c.name AS category_name
FROM book b
JOIN category c ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;
