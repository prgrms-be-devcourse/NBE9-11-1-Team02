package com.team02.cafe.domain.delivery.dto;

public record DeliveryCreateRequest(
        Long orderId,
        String address
) {
}