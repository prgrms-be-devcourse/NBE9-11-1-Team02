package com.team02.cafe.domain.order.entity;

import com.team02.cafe.domain.delivery.entity.Delivery;
import com.team02.cafe.domain.orderproduct.entity.OrderProduct;
import com.team02.cafe.domain.product.entity.Product;
import com.team02.cafe.global.common.BaseTimeEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Table(name = "orders")
public class Order extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    private String orderNumber;

    private String email;
    private String username;
    private String address;
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private long totalPrice;
    private LocalDate deliveryDate;

    @OneToMany(mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    List<OrderProduct> orderProducts = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Delivery> deliveries = new ArrayList<>();

    protected Order() {
        String orderDate = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE); // YYYYMMDD
        String random = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        this.orderNumber = orderDate + "-" + random;
    }

    public Order(String email, String username, String address,
                 String phoneNumber, OrderStatus orderStatus, LocalDate deliveryDate) {
        this();
        this.email = email;
        this.username = username;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.orderStatus = orderStatus;
        this.deliveryDate = deliveryDate;
    }

    // 주문 상품 추가 + 총 금액 증가
    public void addOrderProduct(Product product, long orderQuantity) {
        OrderProduct orderProduct = new OrderProduct(
                this,
                product,
                product.getPrice() * orderQuantity,
                orderQuantity);
        orderProducts.add(orderProduct);
        calculateTotalPrice(product.getPrice(), orderQuantity);
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
