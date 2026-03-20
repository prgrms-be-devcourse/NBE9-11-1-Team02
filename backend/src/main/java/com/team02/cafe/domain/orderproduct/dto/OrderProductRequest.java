package com.team02.cafe.domain.orderproduct.dto;

public record OrderProductRequest(
        Long productId,
        long quantity
) {}
