package com.umc.backend_spring.controller;

import com.umc.backend_spring.dto.CreateRentalRequest;
import com.umc.backend_spring.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRental(@RequestBody CreateRentalRequest request) {
        Long rentalId = rentalService.createRental(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "rentalId", rentalId,
                "message", "도서 대여가 완료되었습니다!"
        ));
    }

    @PatchMapping("/{rentalId}/return")
    public Map<String, Object> returnRental(@PathVariable Long rentalId) {
        rentalService.returnRental(rentalId);
        return Map.of("rentalId", rentalId, "message", "도서 반납이 완료되었습니다!");
    }
}
