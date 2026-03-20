package com.team02.cafe.domain.order.repository;

import com.team02.cafe.domain.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // 이메일과 시간 범위(전날 오후 2시 ~ 당일 오후 2시)를 기준으로 기존 주문 검색
    Optional<Order> findByEmailAndCreatedAtBetween(String email, LocalDateTime start, LocalDateTime end);
}
