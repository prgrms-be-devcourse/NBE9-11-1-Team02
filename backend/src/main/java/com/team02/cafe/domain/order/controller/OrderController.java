package com.team02.cafe.domain.order.controller;

import com.team02.cafe.domain.order.dto.MergedOrderDto;
import com.team02.cafe.domain.order.dto.OrderDetailResponseDto;
import com.team02.cafe.domain.order.dto.OrderRequest;
import com.team02.cafe.domain.order.dto.OrderResponse;
import com.team02.cafe.domain.order.dto.OrderResponseDto;
import com.team02.cafe.domain.order.service.OrderService;
import com.team02.cafe.global.common.RsData;
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
    public RsData<OrderResponse> placeOrder(@RequestBody OrderRequest request) {
        OrderResponse response = orderService.placeOrder(request);
        return RsData.of("200", "주문이 완료되었습니다.", response);
    }

    @PatchMapping("/{orderId}/cancel")
    public RsData<Void> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return RsData.of("200", "주문이 취소되었습니다.");
    }

    // 주문 목록 조회 API
    @GetMapping
    public RsData<List<OrderResponseDto>> getOrders() {
        return RsData.of("200", "주문 목록 조회 성공", orderService.getAllOrders());
    }
    // 주문 상세 조회 API
    @GetMapping("/{orderId}")
    public RsData<OrderDetailResponseDto> getOrderDetails(@PathVariable Long orderId) {
        return RsData.of("200", "주문 상세 조회 성공", orderService.getOrderDetails(orderId));
    }
    // 관리자용 배송 처리 합산 주문 조회 API
    @GetMapping("/merged")
    public RsData<List<MergedOrderDto>> getMergedOrders() {
        return RsData.of("200", "합배송 주문 조회 성공", orderService.getMergedOrdersForDelivery());
    }
}