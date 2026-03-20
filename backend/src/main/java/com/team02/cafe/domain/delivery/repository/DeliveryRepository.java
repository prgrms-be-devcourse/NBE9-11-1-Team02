package com.team02.cafe.domain.delivery.repository;

import com.team02.cafe.domain.delivery.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * JpaRepository 기본적인 CRUD 기능 사용
 
 */
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
	// JpaRepository 기본적인 CRUD 기능 사용
}