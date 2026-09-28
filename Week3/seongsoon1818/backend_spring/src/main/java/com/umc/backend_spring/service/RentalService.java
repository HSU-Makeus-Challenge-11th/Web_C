package com.umc.backend_spring.service;

import com.umc.backend_spring.dto.CreateRentalRequest;
import com.umc.backend_spring.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public Long createRental(CreateRentalRequest request) {
        if (request.userId() == null || request.userId() <= 0
                || request.bookId() == null || request.bookId() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId와 bookId는 양의 정수로 입력해주세요.");
        }

        try {
            return rentalRepository.save(request.userId(), request.bookId());
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "대여할 수 없는 요청입니다. 등록된 userId와 bookId인지 확인해주세요.", exception);
        }
    }

    public void returnRental(Long rentalId) {
        if (rentalId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "rentalId는 양의 정수로 입력해주세요.");
        }

        if (rentalRepository.returnRental(rentalId) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "대여 기록을 찾을 수 없습니다.");
        }
    }
}
