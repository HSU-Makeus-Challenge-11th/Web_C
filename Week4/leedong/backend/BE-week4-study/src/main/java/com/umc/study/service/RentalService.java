package com.umc.study.service;


import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentalService {
    private final RentalRepository rentalRepository;

    @Transactional // 상태 변경과 대여 저장이 함께 성공하거나 함께 취소됨
    public void createRental(Map<String, Object> body) { //Repository에 저장해달라는 코드
        if (rentalRepository.markUnavailable(body.get("bookId")) == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "대여할 수 없는 도서입니다.");
        }
        rentalRepository.save(body);
    }
}
