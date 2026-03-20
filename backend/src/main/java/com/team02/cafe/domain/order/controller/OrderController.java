package com.team02.cafe.domain.order.controller;

import com.team02.cafe.domain.order.dto.OrderRequest;
import com.team02.cafe.domain.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public void placeOrder(@RequestBody OrderRequest request) {
        // v2 order 저장 -> cascade로 이거 저장할때 orderProduct 같이 저장
        orderService.placeOrder(request);

        System.out.println("dd");
    }

    @PatchMapping("/{orderId}/cancel")
    public void cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
    }
}
