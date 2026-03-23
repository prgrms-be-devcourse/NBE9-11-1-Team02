package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.order.entity.Order;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
// OrderResponseDto를 상속받아 공통 필드(이메일, 주소 등)를 가져옵니다.
public class OrderDetailResponseDto extends OrderResponseDto {

    private List<OrderProductDto> orderProducts;

    public OrderDetailResponseDto(Order order) {
        super(order); // 부모 클래스 생성자 호출
        // Order 엔티티에 양방향 연관관계가 있으므로 바로 꺼내어 변환합니다.
        this.orderProducts = order.getOrderProducts().stream()
                .map(OrderProductDto::new)
                .collect(Collectors.toList());
    }
}
