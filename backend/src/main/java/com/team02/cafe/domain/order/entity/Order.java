package com.team02.cafe.domain.order.entity;

import com.team02.cafe.domain.orderproduct.entity.OrderProduct;
import com.team02.cafe.global.common.BaseTimeEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "orders")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String username;

    private String address;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private Long totalPrice;

    @OneToMany(mappedBy = "order",
                cascade = CascadeType.ALL,
                orphanRemoval = true)
    List<OrderProduct> orderProducts = new ArrayList<>();

    public Order(String email, String username, String address, String phoneNumber, OrderStatus orderStatus) {
        this.email = email;
        this.username = username;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.orderStatus = orderStatus;
    }

    public void addOrderProducts(OrderProduct orderProduct) {
        // TODO: OrderProduct 생성 후 리스트에 추가 & 자기 자신 order 연결
//        orderProducts.add(orderProduct);
    }

    // TODO: 총금액 계산 함수 추가
}
