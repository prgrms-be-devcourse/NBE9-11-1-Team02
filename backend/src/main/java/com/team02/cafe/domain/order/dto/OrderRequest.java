package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.orderproduct.dto.OrderProductRequest;

import java.util.List;

public record OrderRequest(
        String email,
        String username,
        String address,
        String phoneNumber,
        List<OrderProductRequest> orderProductRequestList
) {}
