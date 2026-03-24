package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class MergedOrderDto {
    private Long orderId;
    private String email;
    private String username;
    private String address;
    private String phoneNumber;
    private long totalPrice; // 모든 주문 금액을 합친 총액
    private LocalDate deliveryDate;
    private OrderStatus orderStatus;
    private List<MergedProductDto> products;
}
