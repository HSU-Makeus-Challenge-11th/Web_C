package com.umc.study.service;

import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    // 미션 2: 대여 기록 생성
    public void createRental(Map<String, Object> body) {
        rentalRepository.save(body);
    }
}