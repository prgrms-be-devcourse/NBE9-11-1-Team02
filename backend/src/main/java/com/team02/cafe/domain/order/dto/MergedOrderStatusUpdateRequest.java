package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.order.entity.OrderStatus;

public record MergedOrderStatusUpdateRequest(
        String email,
        String username,
        String address,
        OrderStatus orderStatus
) {
}