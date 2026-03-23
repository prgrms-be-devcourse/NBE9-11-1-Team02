package com.team02.cafe.domain.order.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MergedProductDto {
    private String productName;
    private long totalQuantity; // 합쳐진 총 수량
    private long totalPrice;    // 합쳐진 총 금액
}
