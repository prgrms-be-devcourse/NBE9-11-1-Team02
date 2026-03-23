package com.team02.cafe.domain.delivery.service;

import com.team02.cafe.domain.delivery.entity.Delivery;
import com.team02.cafe.domain.delivery.repository.DeliveryRepository;
<<<<<<< HEAD
=======
import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.order.repository.OrderRepository;
>>>>>>> 0fc2eda85929e041633c8de34d4295fd08757cbc
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

<<<<<<< HEAD
// 핵심 비즈니스 로직

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 최적화를 위해 읽기 전용을 기본으로 설정.
public class DeliveryService {

    private final DeliveryRepository repository;

    @Transactional // 쓰기 작업 권한 설정.
    public Long join(String address) {
        Delivery delivery = new Delivery();
        delivery.setAddress(address);
        
        // 저장소에 명령 전송.
        return repository.save(delivery).getId();
=======
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
>>>>>>> 0fc2eda85929e041633c8de34d4295fd08757cbc
    }
}