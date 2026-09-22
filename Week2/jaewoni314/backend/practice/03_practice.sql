USE book_rental;

-- 0-1. 접속 확인
SELECT VERSION();

-- 1-1. 단일 테이블: 대여 가능한 책 찾기
-- 요구사항: 대여 가능한 책의 제목과 설명을 최신순으로 보여 주세요.
SELECT book_id, title, description
FROM book
WHERE is_available = TRUE
ORDER BY book_id DESC;

-- 1-2. JOIN: 카테고리별 도서 목록 만들기
-- 요구사항: 문학 카테고리에서 대여 가능한 책을 10권 보여 주세요.
-- 카테고리 이름은 category 테이블에 있으므로 book → category JOIN이 필요합니다.
SELECT b.book_id, b.title, c.name AS category_name
FROM book b
JOIN category c ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;

-- 1-3. 책의 태그: book → book_tag → tag
-- 요구사항: 1번 책에 붙은 태그를 보여 주세요.
SELECT b.title, t.name AS tag_name
FROM book b
JOIN book_tag bt ON b.book_id = bt.book_id
JOIN tag t ON bt.tag_id = t.tag_id
WHERE b.book_id = 1
ORDER BY t.tag_id;

-- 1-3. 좋아요: users N:M book (book_like)
-- 요구사항: 1번 사용자가 좋아요한 책을 보여 주세요.
SELECT b.book_id, b.title
FROM book_like bl
JOIN book b ON bl.book_id = b.book_id
WHERE bl.user_id = 1
ORDER BY b.book_id DESC;

-- 1-4. 도서 목록과 LIMIT/OFFSET
-- 첫 페이지: 앞에서 0개를 건너뛰고 10개
SELECT book_id, title
FROM book
ORDER BY book_id DESC
LIMIT 10 OFFSET 0;

-- 두 번째 페이지: 앞에서 10개를 건너뛰고 10개 (현재 데이터는 3권이라 0건)
SELECT book_id, title
FROM book
ORDER BY book_id DESC
LIMIT 10 OFFSET 10;
