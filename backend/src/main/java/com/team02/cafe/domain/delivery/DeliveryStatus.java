package com.back.backend.domain.user.entity;

public enum DeliveryStatus {
    READY,     // 배송 준비
    SHIPPING,  // 배송 중
    COMPLETED, // 배송 완료
    CANCELED   // 취소됨
}