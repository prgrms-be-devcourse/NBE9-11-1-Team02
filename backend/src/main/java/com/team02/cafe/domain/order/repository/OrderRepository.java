package com.team02.cafe.domain.order.repository;

import com.team02.cafe.domain.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // 이메일 + 시간 범위 기준 주문 조회
    Optional<Order> findByEmailAndCreatedAtBetween(
            String email,
            LocalDateTime start,
            LocalDateTime end
    );
}