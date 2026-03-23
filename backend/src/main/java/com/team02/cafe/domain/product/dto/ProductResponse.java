package com.team02.cafe.domain.product.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.team02.cafe.domain.product.entity.Product;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ProductResponse {

    private Long id;
    private String name;
    private Long price;
    private Long quantity;

    @JsonProperty("image_url")
    private String imageUrl;

    private LocalDateTime createdAt;

    public ProductResponse(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.price = product.getPrice();
        this.quantity = product.getQuantity();
        this.imageUrl = product.getImageUrl();
        this.createdAt = product.getCreatedAt();
    }
}
