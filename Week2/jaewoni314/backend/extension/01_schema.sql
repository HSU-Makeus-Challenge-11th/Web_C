-- 1주차 미션 ERD(지역별 가게 미션 리워드 서비스) 중
-- 확장 쿼리에 필요한 테이블만 만듭니다.
DROP DATABASE IF EXISTS umc_mission;
CREATE DATABASE umc_mission DEFAULT CHARACTER SET utf8mb4;
USE umc_mission;

CREATE TABLE member (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(20) NOT NULL,
  nickname      VARCHAR(20),
  gender        VARCHAR(10),
  birth         DATE,
  address       VARCHAR(40),
  detail_address VARCHAR(40),
  email         VARCHAR(50),
  phone_number  VARCHAR(20),
  phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
  point         INT NOT NULL DEFAULT 0,
  social_type   VARCHAR(10),
  social_id     VARCHAR(100),
  status        VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  inactive_date DATETIME,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE region (
  id   BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL
);

CREATE TABLE food_category (
  id   BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(15) NOT NULL
);

CREATE TABLE store (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id   BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  name        VARCHAR(50) NOT NULL,
  address     VARCHAR(50),
  latitude    DECIMAL(10, 7),
  longitude   DECIMAL(10, 7),
  score       FLOAT NOT NULL DEFAULT 0,
  owner_code  VARCHAR(20),
  status      VARCHAR(10) NOT NULL DEFAULT 'OPEN',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES region(id),
  FOREIGN KEY (category_id) REFERENCES food_category(id)
);

CREATE TABLE mission (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  store_id   BIGINT NOT NULL,
  reward     INT NOT NULL,
  min_price  INT NOT NULL,
  deadline   DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES store(id)
);

-- status: IN_PROGRESS(진행중) / COMPLETE(진행완료)
CREATE TABLE member_mission (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  member_id  BIGINT NOT NULL,
  mission_id BIGINT NOT NULL,
  status     VARCHAR(15) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES member(id),
  FOREIGN KEY (mission_id) REFERENCES mission(id)
);
