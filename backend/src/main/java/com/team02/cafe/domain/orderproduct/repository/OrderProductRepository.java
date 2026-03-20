package com.team02.cafe.domain.orderproduct.repository;

import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.orderproduct.entity.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderProductRepository extends JpaRepository<OrderProduct, Long> {

    List<OrderProduct> findByOrder(Order order);
}
