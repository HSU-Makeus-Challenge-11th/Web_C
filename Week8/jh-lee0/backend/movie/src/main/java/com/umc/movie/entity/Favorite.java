// src/main/java/com/umc/movie/entity/Favorite.java
package com.umc.movie.entity;

import jakarta.persistence.Column; // jakarta 는 JPA의 표준 어노테이션들
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel; // lombok은 반복되는 자바 코드를 자동으로 만들어주는 라이브러리
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity // 이 클래스는 DB의 테이블과 연결된 엔티티임을 알림
@Table( // 테이블에 대한 세부 정보
        // 테이블명
        name = "favorite",
        // member_id와 movie_id 두 개를 한 쌍으로 중복 불가 제약(중요)
        uniqueConstraints = @UniqueConstraint(columnNames = {"member_id", "movie_id"})
)
@Getter // 모든 필드의 getter 자동 생성
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 매개변수 없는 기본 생성자 자동 생성, 접근 지정자는 protected
public class Favorite extends BaseTimeEntity { // entity/BaseTimeEntity를 상속해 created_at, updated_at을 사용한다

    @Id // 이 필드가 pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB가 AUTO_INCREMENT로 자동 증가
    @Column(name = "favorite_id") // DB에서의 컬럼명은 favorite_id
    private Long favoriteId;

    // 중요! fetch = FetchType.LAZY 는 즐겨찾기 조회할 때, 회원 정보는 진짜 필요할 때까지 가져옹지 않음! (성능 향상 위함)
    @ManyToOne(fetch = FetchType.LAZY) // 다대일 관계 -> 즐겨찾기 여러 개가 회원 한 명에 속함
    @JoinColumn(name = "member_id", nullable = false) // 연결에 사용하는 DB컬럼은 member_id이고, null이면 안된다
    private Member member; // 이 Member필드가 MantToOne 관계에서 One이다!

    // TMDB의 영화 ID를 그대로 저장합니다. 우리 DB의 외래 키는 아닙니다.
    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    // 빌더: 객체를 만들 때 new Favorite(1, 2)가 아닌
    // new Favorite.builder().member(id).movieId(2)와 같이 선언하여 가독성 향상
    @Builder
    public Favorite(Member member, Long movieId) {
        this.member = member;
        this.movieId = movieId;
    }
}
