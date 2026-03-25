package com.team02.cafe.domain.order.dto;

import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.order.entity.OrderStatus;
import com.team02.cafe.domain.orderproduct.dto.OrderProductResponse;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class OrderResponseDto {
    private Long orderId;
    private String orderNumber;
    private String email;
    private String username;
    private String address;
    private String phoneNumber;
    private OrderStatus orderStatus;
    private long totalPrice;
    private LocalDate deliveryDate;
    private LocalDateTime createdAt;

    private List<OrderProductResponse> orderProducts;

    public OrderResponseDto(Order order) {
        this.orderId = order.getId();
        this.orderNumber = order.getOrderNumber();
        this.email = order.getEmail();
        this.username = order.getUsername();
        this.address = order.getAddress();
        this.phoneNumber = order.getPhoneNumber();
        this.orderStatus = order.getOrderStatus();
        this.totalPrice = order.getTotalPrice();
        this.deliveryDate = order.getDeliveryDate();
        this.createdAt = order.getCreatedAt();

        this.orderProducts = order.getOrderProducts().stream()
                .map(OrderProductResponse::new)
                .collect(Collectors.toList());
    }
}