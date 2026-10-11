package com.umc.study.service;


import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentalService {
    private final RentalRepository rentalRepository;

    public void createRental(Map<String, Object> body) { //Repository에 저장해달라는 코드
        rentalRepository.save(body);
    }
}
