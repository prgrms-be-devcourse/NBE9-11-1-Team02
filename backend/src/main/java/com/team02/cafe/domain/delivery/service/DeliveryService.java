package com.team02.cafe.domain.delivery.service;

import com.team02.cafe.domain.delivery.entity.Delivery;
import com.team02.cafe.domain.delivery.repository.DeliveryRepository;
import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;

    public Long join(Long orderId, String address) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        Delivery delivery = new Delivery();
        delivery.setAddress(address);
        delivery.setOrder(order);

        deliveryRepository.save(delivery);
        return delivery.getId();
    }
}