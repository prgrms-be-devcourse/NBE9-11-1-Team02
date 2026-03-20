package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.order.entity.Order;
import lombok.Getter;

import java.util.List;

@Getter
public class OrderDetailResponseDto {
    // 기본 주문 정보에 더해 주문한 상품 목록을 포함합니다.
    private List<OrderProductDto> orderProducts;

    public OrderDetailResponseDto(Order order, List<OrderProductDto> orderProducts) {
        super();
        this.orderProducts = orderProducts;
    }
}
