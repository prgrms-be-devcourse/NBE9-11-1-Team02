package com.team02.cafe.domain.delivery.entity;

import com.team02.cafe.domain.order.entity.Order;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 배송 번호

    private String address; // 배송 주소

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status = DeliveryStatus.READY; // 초기 상태 READY

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
}