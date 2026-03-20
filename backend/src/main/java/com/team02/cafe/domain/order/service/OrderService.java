package com.team02.cafe.domain.order.service;

import com.team02.cafe.domain.order.dto.OrderRequest;
import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.order.entity.OrderStatus;
import com.team02.cafe.domain.order.repository.OrderRepository;
import com.team02.cafe.domain.orderproduct.dto.OrderProductRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public void placeOrder(OrderRequest request) {
        Order order = new Order(
                request.email(),
                request.username(),
                request.address(),
                request.phoneNumber(),
                OrderStatus.READY
        );
        // TODO: 상품목록 추가 & totalPrice 계산
        for(OrderProductRequest opReq : request.orderProductRequestList()) {

        }



    }
}
