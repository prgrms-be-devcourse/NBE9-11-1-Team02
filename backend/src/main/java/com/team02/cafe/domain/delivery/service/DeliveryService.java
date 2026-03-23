package com.team02.cafe.domain.delivery.service;

import com.team02.cafe.domain.delivery.entity.Delivery;
import com.team02.cafe.domain.delivery.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    }
}