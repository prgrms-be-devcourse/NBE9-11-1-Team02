package com.team02.cafe.domain.orderproduct.repository;

import com.team02.cafe.domain.orderproduct.entity.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderProductRepository extends JpaRepository<OrderProduct, Long> {
    // 특정 주문(Order)에 포함된 주문 상품(OrderProduct) 목록을 조회 (Order 엔티티에 연관관계가 없으므로 직접 조회해야 함)
    List<OrderProduct> findByOrderId(Long orderId);
}
