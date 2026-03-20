package com.team02.cafe.domain.order.entity;

import com.team02.cafe.domain.orderproduct.entity.OrderProduct;
import com.team02.cafe.domain.product.entity.Product;
import com.team02.cafe.global.common.BaseTimeEntity;
import jakarta.persistence.*;
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

    private long totalPrice;

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

    // 주문 상품 추가 + 총 금액 증가
    public void addOrderProduct(Product product, long quantity) {
        OrderProduct orderProduct = new OrderProduct(
                this, product, product.getPrice(), quantity);
        orderProducts.add(orderProduct);
        calculateTotalPrice(product.getPrice(), quantity);
    }

    // 총 금액 누적
    private void calculateTotalPrice(long price, long quantity) {
        this.totalPrice += price * quantity;
    }

    // 주문 상태 변경 (취소 등)
    public void changeStatus(OrderStatus status) {
        this.orderStatus = status;
    }
}