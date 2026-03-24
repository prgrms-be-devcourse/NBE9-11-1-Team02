package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.order.entity.Order;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
// OrderResponseDto를 상속받아 공통 필드(이메일, 주소 등)를 가져옵니다.
public class OrderDetailResponseDto extends OrderResponseDto {

    public OrderDetailResponseDto(Order order) {
        super(order);
    }
}
