package com.team02.cafe.domain.product.entity;

import com.team02.cafe.global.common.BaseTimeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Long price;

    private Long quantity;

    private String imageUrl;

    public Product(String name, Long price, Long quantity, String imageUrl) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }

    public void update(String name, Long price, Long quantity, String imageUrl) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }

    public void decreaseQuantity(Long quantity) {
        if (this.quantity < quantity) {
            throw new IllegalArgumentException("재고가 부족합니다. 현재 재고: " + this.quantity);
        }
        this.quantity -= quantity;
    }

    public void increaseQuantity(Long quantity) {
        this.quantity += quantity;
    }

    public void increaseQuantity(Long Quantity) {
        this.quantity += quantity;
    }
}