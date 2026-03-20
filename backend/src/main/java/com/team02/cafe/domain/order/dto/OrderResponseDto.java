package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.order.entity.OrderStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class OrderResponseDto {
    private Long orderId;
    private String email;
    private String username; // 추가된 엔티티 반영
    private String address;
    private String phoneNumber;
    private OrderStatus orderStatus;
    private long totalPrice;
    private LocalDateTime createdAt;

    public OrderResponseDto(Order order) {
        this.orderId = order.getId();
        this.email = order.getEmail();
        this.username = order.getUsername();
        this.address = order.getAddress();
        this.phoneNumber = order.getPhoneNumber();
        this.orderStatus = order.getOrderStatus();
        this.totalPrice = order.getTotalPrice();
        this.createdAt = order.getCreatedAt();
    }
}
