package com.team02.cafe.domain.orderproduct.dto;

public record OrderProductResponse(
        Long productId,
        String productName
        // orderPrice, orderQuantity
) {}
