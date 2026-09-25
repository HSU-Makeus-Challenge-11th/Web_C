USE umc_week2;

-- 접속 확인
SELECT VERSION();

SELECT b.title, b.description, c.name AS category_name
FROM book b
JOIN category c ON b.category_id = c.category_id
WHERE c.name = '문학' AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;

SELECT b.title, r.rented_at, r.due_at
FROM rental r
JOIN book b ON r.book_id = b.book_id
WHERE r.user_id = 1 AND r.returned_at IS NULL
ORDER BY r.due_at ASC;

SELECT b.title,
       t.name AS tag_name,
       CASE WHEN bl.user_id IS NULL THEN 'N' ELSE 'Y' END AS is_liked
FROM book b
LEFT JOIN book_tag bt ON b.book_id = bt.book_id
LEFT JOIN tag t ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl ON b.book_id = bl.book_id AND bl.user_id = 1
WHERE b.book_id = 1
ORDER BY t.tag_id;

SELECT b.title, c.name AS category_name
FROM book_like bl
JOIN book b ON bl.book_id = b.book_id
JOIN category c ON b.category_id = c.category_id
WHERE bl.user_id = 1
ORDER BY b.book_id DESC
LIMIT 10;
