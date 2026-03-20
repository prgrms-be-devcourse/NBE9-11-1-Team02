package com.team02.cafe.domain.order.service;

import com.team02.cafe.domain.order.dto.OrderRequest;
import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.order.entity.OrderStatus;
import com.team02.cafe.domain.order.repository.OrderRepository;
import com.team02.cafe.domain.orderproduct.dto.OrderProductRequest;
import com.team02.cafe.domain.product.entity.Product;
import com.team02.cafe.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void placeOrder(OrderRequest request) {
        Order order = new Order(
                request.email(),
                request.username(),
                request.address(),
                request.phoneNumber(),
                OrderStatus.READY
        );

        for(OrderProductRequest opReq : request.orderProductRequestList()) {
            Product product = productRepository.findById(opReq.productId())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 상품입니다."));
            long quantity = opReq.quantity();

            order.addOrderProduct(product, quantity);
        }
        orderRepository.save(order);
    }
}
