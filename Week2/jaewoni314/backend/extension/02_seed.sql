USE umc_mission;

INSERT INTO member (name, nickname) VALUES ('김재원', '워니'), ('이성진', '성순');

INSERT INTO region (name) VALUES ('안암동'), ('성북동');

INSERT INTO food_category (name) VALUES ('한식'), ('중식'), ('카페');

INSERT INTO store (region_id, category_id, name) VALUES
  (1, 1, '안암 국밥집'),
  (1, 2, '반점 101'),
  (1, 3, '카페 안암'),
  (2, 1, '성북 칼국수');

INSERT INTO mission (store_id, reward, min_price, deadline) VALUES
  (1, 500, 10000, '2026-10-10 23:59:59'),
  (2, 300,  8000, '2026-10-05 23:59:59'),
  (3, 200,  5000, '2026-10-20 23:59:59'),
  (4, 500, 12000, '2026-10-15 23:59:59');

INSERT INTO member_mission (member_id, mission_id, status, created_at) VALUES
  (1, 1, 'IN_PROGRESS', '2026-09-15 12:00:00'),
  (1, 2, 'COMPLETE',    '2026-09-10 12:00:00'),
  (1, 3, 'IN_PROGRESS', '2026-09-18 12:00:00'),
  (2, 4, 'IN_PROGRESS', '2026-09-17 12:00:00');
