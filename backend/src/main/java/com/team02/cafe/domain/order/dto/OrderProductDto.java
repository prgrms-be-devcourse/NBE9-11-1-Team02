package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.orderproduct.entity.OrderProduct;
import lombok.Getter;

@Getter
public class OrderProductDto {
    private String productName;
    private Long price;
    private Long quantity;

    public OrderProductDto(OrderProduct orderProduct) {
        // Product 엔티티에서 이름을 가져옴
        this.productName = orderProduct.getProduct().getName();
        this.price = orderProduct.getOrderPrice();
        this.quantity = orderProduct.getOrderQuantity();
        this.price = orderProduct.getOrderPrice();
        this.quantity = orderProduct.getOrderQuantity();
    }
}
