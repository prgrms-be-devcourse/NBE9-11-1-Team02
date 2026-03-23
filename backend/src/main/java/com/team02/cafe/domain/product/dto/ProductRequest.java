package com.team02.cafe.domain.product.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class ProductRequest {

    private String name;
    private Long price;
    private Long quantity;

    @JsonProperty("image_url")
    private String imageUrl;

}
