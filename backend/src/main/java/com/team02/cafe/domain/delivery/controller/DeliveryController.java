package com.team02.cafe.domain.delivery.controller;

import com.team02.cafe.domain.delivery.dto.DeliveryCreateRequest;
import com.team02.cafe.domain.delivery.service.DeliveryService;
import com.team02.cafe.global.common.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/delivery")
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping
    public RsData<Long> create(@RequestBody DeliveryCreateRequest request) {
        Long deliveryId = deliveryService.join(request.orderId(), request.address());
        return RsData.of("200", "배송 생성 완료", deliveryId);
    }
}