-- 선택 미션 3. 중복 도서 등록 방지
-- synchronize: false라서 엔티티의 unique: true만으로는 DB에 반영되지 않으므로 직접 적용해요.
USE book_rental;

ALTER TABLE book ADD CONSTRAINT uk_book_title UNIQUE (title);
