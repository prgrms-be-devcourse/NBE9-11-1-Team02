package com.team02.cafe.domain.order.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MergedProductDto {
    private String name;
    private long quantity;
    private long totalPrice;
}