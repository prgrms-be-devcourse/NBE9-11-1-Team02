package com.team02.cafe.domain.orderproduct.dto;

import com.team02.cafe.domain.orderproduct.entity.OrderProduct;

public record OrderProductResponse(
        Long productId,
        String productName,
        long orderPrice,
        long orderQuantity
) {

    public OrderProductResponse(OrderProduct orderProduct) {
        this(orderProduct.getProduct().getId(),
                orderProduct.getProduct().getName(),
                orderProduct.getOrderPrice(),
                orderProduct.getOrderQuantity());
    }

}
