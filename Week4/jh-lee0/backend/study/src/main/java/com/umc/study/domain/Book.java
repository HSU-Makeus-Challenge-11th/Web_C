package com.umc.study.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "book") // 이 클래스는 'book'이라는 테이블과 매핑됨
@Getter // 각 필드의 Getter 메서드를 자동으로 생성
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 파라미터가 없는 기본 생성자를 만들어줌 (각 필드의 값을 외부에서 읽을 수 있게 하기 위함)
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본키 생성 전략을 DB의 AUTO_INCREMENT에 위임
    @Column(name = "book_id") // 필드명과 실제 DB의 컬럼명을 매핑
    private Long bookId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false) // FK를 DB의 'category_id' 임을 지정
    private Category category;

    @Column(nullable = false, length = 100, unique = true)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    public Book(Category category, String title, String description) {
        this.category = category;
        this.title = title;
        this.description = description;
    }
}
