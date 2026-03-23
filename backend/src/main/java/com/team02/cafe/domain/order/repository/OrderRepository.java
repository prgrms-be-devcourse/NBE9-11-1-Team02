package com.team02.cafe.domain.order.repository;

import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.order.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // 같은 이메일 + 같은 주문 집계 시간대 + 취소되지 않은 주문 조회
    Optional<Order> findByEmailAndCreatedAtBetweenAndOrderStatusNot(
            String email,
            LocalDateTime start,
            LocalDateTime end,
            OrderStatus orderStatus
    );

    // 관리자 합치기용: 특정 기간 내의 '모든' 정상 주문 목록 조회
    List<Order> findByCreatedAtBetweenAndOrderStatusNot(
            LocalDateTime start,
            LocalDateTime end,
            OrderStatus orderStatus
    );


    List<Order> findByEmailOrderByCreatedAtDesc(String email);

}