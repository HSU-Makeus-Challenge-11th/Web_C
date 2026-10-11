package com.umc.study.controller;


import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/rentals") //이 클래스가 담당하는 기본주소를 /rentals로 지정
@RequiredArgsConstructor
public class RentalController {
    private final RentalService rentalService;

    @PostMapping
    //postman이 보낸 json을 Map으로 자동 변환해서 받음 즉 postman으로 전달할때 텍스트로 전달을 할수 없는데 key:value로 Map으로 자동으로 변환을 해서 보내줌
    public String createRental(@RequestBody Map<String, Object> body) {
        rentalService.createRental(body);
        return "도서 대여가 완료되었습니다!";
    }
}
