package com.team02.cafe.domain.order.controller;

import com.team02.cafe.domain.order.dto.MergedOrderDto;
import com.team02.cafe.domain.order.dto.OrderDetailResponseDto;
import com.team02.cafe.domain.order.dto.OrderRequest;
import com.team02.cafe.domain.order.dto.OrderResponse;
import com.team02.cafe.domain.order.dto.OrderResponseDto;
import com.team02.cafe.domain.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest request) {
        // order 저장 -> orderProduct 같이 저장
        OrderResponse response = orderService.placeOrder(request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{orderId}/cancel")
    public void cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
    }

    // 주문 목록 조회 API
    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // 주문 상세 조회 API
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDetailResponseDto> getOrderDetails(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderDetails(orderId));
    }

    // 관리자용 배송 처리 합산 주문 조회 API
    @GetMapping("/merged")
    public ResponseEntity<List<MergedOrderDto>> getMergedOrders() {
        return ResponseEntity.ok(orderService.getMergedOrdersForDelivery());
    }
}