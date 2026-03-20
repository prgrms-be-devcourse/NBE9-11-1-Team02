package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.order.entity.OrderStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class OrderResponseDto {
    private Long orderId;
    private String email;
    private String address;
    private String phoneNumber; // 엔티티에 맞춰 추가
    private OrderStatus orderStatus;
    private Long totalPrice;
    private LocalDateTime createdAt; // BaseTimeEntity에 있는 필드라고 가정

    public OrderResponseDto(Order order) {
        this.orderId = order.getId();
        this.email = order.getEmail();
        this.address = order.getAddress();
        this.phoneNumber = order.getPhoneNumber();
        this.orderStatus = order.getOrderStatus();
        this.totalPrice = order.getTotalPrice();
        this.createdAt = order.getCreatedAt();
    }
}
