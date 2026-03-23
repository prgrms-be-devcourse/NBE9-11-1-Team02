package com.team02.cafe.domain.order.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class MergedOrderDto {
    private String email;
    private String address;
    private String phoneNumber;
    private long totalPrice; // 모든 주문 금액을 합친 총액
    private List<MergedProductDto> products; // 합쳐진 상품 목록
}
