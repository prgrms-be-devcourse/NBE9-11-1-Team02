package com.team02.cafe.domain.orderproduct.entity;

import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.product.entity.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "order_product")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private Long orderPrice;

    private Long orderQuantity;

    public OrderProduct(Order order, Product product, Long orderPrice, Long orderQuantity) {
        this.order = order;
        this.product = product;
        this.orderPrice = orderPrice;
        this.orderQuantity = orderQuantity;
    }
}
