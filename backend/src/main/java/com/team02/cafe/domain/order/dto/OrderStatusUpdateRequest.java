package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.order.entity.OrderStatus;

public record OrderStatusUpdateRequest(
        OrderStatus orderStatus
) {
}