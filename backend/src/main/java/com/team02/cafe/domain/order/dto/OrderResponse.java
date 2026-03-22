package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.order.entity.OrderStatus;
import com.team02.cafe.domain.orderproduct.dto.OrderProductResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String email,
        String username,
        String address,
        String phoneNumber,
        OrderStatus orderStatus,
        LocalDate deliveryDate,
        long totalPrice,
        LocalDateTime createdAt,
        List<OrderProductResponse> productResponseList
) {

    public OrderResponse(Order order) {
        this(
                order.getId(),
                order.getEmail(),
                order.getUsername(),
                order.getAddress(),
                order.getPhoneNumber(),
                order.getOrderStatus(),
                order.getDeliveryDate(),
                order.getTotalPrice(),
                order.getCreatedAt(),
                order.getOrderProducts().stream()
                        .map(OrderProductResponse::new)
                        .toList()
                );
    }

}
