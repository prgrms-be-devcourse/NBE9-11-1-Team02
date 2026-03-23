package com.team02.cafe.domain.delivery.controller;

import com.team02.cafe.domain.delivery.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

// 외부(JavaScript) 와 통신하는 API 연결


@RestController
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService service;

    // 주소 정보를 받아 배송을 시작하는 API 연결.
    @PostMapping("/api/delivery")
    public Long create(@RequestBody String address) {
        return service.join(address);
    }
}