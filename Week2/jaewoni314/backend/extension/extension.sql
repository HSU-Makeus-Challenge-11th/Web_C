USE umc_mission;

-- 확장. 미션 탭 - 로그인한 회원(member_id = 1)의 진행중 미션 목록을 최근 도전순으로 10개 조회
-- 결과: 가게 이름, 음식 카테고리, 미션 보상, 최소 주문 금액, 마감일, 도전 시작일
--
-- 기준 테이블: "내가 도전한 미션"은 회원과 미션의 N:M 관계를 푼 member_mission에 있으므로 여기서 시작합니다.
-- JOIN 이유: 보상·최소 금액·마감일은 mission(member_mission.mission_id → mission.id)에,
--           가게 이름은 store(mission.store_id → store.id)에,
--           카테고리 이름은 food_category(store.category_id → food_category.id)에 있어 관계를 따라 JOIN합니다.
-- WHERE 조건: 현재 로그인한 회원이면서 status가 IN_PROGRESS(진행중)인 기록만 남깁니다.
-- 정렬·범위: 최근에 도전한 순(created_at 내림차순, 같으면 id 내림차순)으로 첫 페이지 10개를 가져옵니다.
SELECT
  s.name  AS store_name,
  fc.name AS category_name,
  m.reward,
  m.min_price,
  m.deadline,
  mm.created_at AS started_at
FROM member_mission mm
JOIN mission m        ON mm.mission_id = m.id
JOIN store s          ON m.store_id = s.id
JOIN food_category fc ON s.category_id = fc.id
WHERE mm.member_id = 1
  AND mm.status = 'IN_PROGRESS'
ORDER BY mm.created_at DESC, mm.id DESC
LIMIT 10 OFFSET 0;
