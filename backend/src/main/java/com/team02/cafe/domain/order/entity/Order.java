package com.team02.cafe.domain.order.entity;

import com.team02.cafe.global.common.BaseTimeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "orders")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String address;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private Long totalPrice;

    public Order(String email, String address, String phoneNumber, OrderStatus orderStatus, Long totalPrice) {
        this.email = email;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.orderStatus = orderStatus;
        this.totalPrice = totalPrice;
    }

    public void changeStatus(OrderStatus status) {
        this.orderStatus = status;
    }
}