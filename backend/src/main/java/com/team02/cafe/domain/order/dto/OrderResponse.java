package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.order.entity.OrderStatus;
import com.team02.cafe.domain.orderproduct.dto.OrderProductResponse;

import java.util.List;

public record OrderResponse(
        Long id,
        String email,
        String username,
        String address,
        String phoneNumber,
        OrderStatus orderStatus,
        long totalPrice,
        List<OrderProductResponse> productResponseList
) {}
