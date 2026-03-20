package com.team02.cafe.domain.orderproduct.repository;

import com.team02.cafe.domain.orderproduct.entity.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderProductRepository extends JpaRepository<OrderProduct, Long> {

    // 특정 주문의 상품 목록 조회
    List<OrderProduct> findByOrderId(Long orderId);
}