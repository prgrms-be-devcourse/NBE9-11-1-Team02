package com.team02.cafe.domain.order.controller;

import com.team02.cafe.domain.order.dto.*;
import com.team02.cafe.domain.order.service.OrderService;
import com.team02.cafe.global.common.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public RsData<List<OrderResponseDto>> getOrders(@RequestParam String email) {
        return RsData.of("200", "내 주문 내역 조회 성공", orderService.getOrdersByEmail(email));
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

    @PatchMapping("/{orderId}/status")
    public RsData<Void> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody OrderStatusUpdateRequest request
    ) {
        orderService.updateOrderStatus(orderId, request.orderStatus());
        return RsData.of("200", "주문 상태가 변경되었습니다.");
    }

    @PatchMapping("/merged/status")
    public RsData<Void> updateMergedOrderStatus(
            @RequestBody MergedOrderStatusUpdateRequest request
    ) {
        orderService.updateMergedOrderStatus(
                request.email(),
                request.username(),
                request.address(),
                request.orderStatus()
        );
        return RsData.of("200", "합배송 주문 상태가 변경되었습니다.");
    }
}
