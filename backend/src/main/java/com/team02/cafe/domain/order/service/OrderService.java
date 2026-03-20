package com.team02.cafe.domain.order.service;

import com.team02.cafe.domain.order.dto.OrderDetailResponseDto;
import com.team02.cafe.domain.order.dto.OrderRequest;
import com.team02.cafe.domain.order.dto.OrderResponseDto;
import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.order.entity.OrderStatus;
import com.team02.cafe.domain.order.repository.OrderRepository;
import com.team02.cafe.domain.orderproduct.dto.OrderProductRequest;
import com.team02.cafe.domain.orderproduct.entity.OrderProduct;
import com.team02.cafe.domain.orderproduct.repository.OrderProductRepository;
import com.team02.cafe.domain.product.entity.Product;
import com.team02.cafe.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderProductRepository orderProductRepository;

    @Transactional
    public void placeOrder(OrderRequest request) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start;
        LocalDateTime end;

        // 오후 2시 기준 기간 계산
        if (now.toLocalTime().isBefore(LocalTime.of(14, 0))) {
            start = LocalDateTime.of(now.toLocalDate().minusDays(1), LocalTime.of(14, 0));
            end = LocalDateTime.of(now.toLocalDate(), LocalTime.of(14, 0));
        } else {
            start = LocalDateTime.of(now.toLocalDate(), LocalTime.of(14, 0));
            end = LocalDateTime.of(now.toLocalDate().plusDays(1), LocalTime.of(14, 0));
        }

        // 기존 주문이 있는지 조회
        Optional<Order> existingOrder = orderRepository.findByEmailAndCreatedAtBetween(request.email(), start, end);

        // 기존 주문이 있으면 가져오고, 없으면 새로 생성
        Order order = existingOrder.orElseGet(() -> new Order(
                request.email(),
                request.username(),
                request.address(),
                request.phoneNumber(),
                OrderStatus.READY
        ));


        for (OrderProductRequest opReq : request.orderProductRequestList()) {
            Product product = productRepository.findById(opReq.productId())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 상품입니다."));
            long quantity = opReq.quantity();

            order.addOrderProduct(product, quantity);
        }

        // 새로 만든 주문일 때만 명시적 저장 (기존 주문은 JPA 변경감지로 업데이트됨)
        if (existingOrder.isEmpty()) {
            orderRepository.save(order);
        }
    }

    // [기존 유지] 주문 취소 로직
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("이미 취소된 주문입니다.");
        }

        if (order.getOrderStatus() == OrderStatus.COMPLETED) {
            throw new IllegalArgumentException("배송 완료된 주문은 취소할 수 없습니다.");
        }

        List<OrderProduct> orderProducts = orderProductRepository.findByOrderId(order.getId());

        for (OrderProduct orderProduct : orderProducts) {
            Product product = orderProduct.getProduct();
            product.increaseQuantity(orderProduct.getQuantity());
        }

        order.changeStatus(OrderStatus.CANCELLED);
    }

    // [추가] 2. 주문 목록 조회
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderResponseDto::new)
                .collect(Collectors.toList());
    }

    // [추가] 3. 주문 상세 조회
    @Transactional(readOnly = true)
    public OrderDetailResponseDto getOrderDetails(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        return new OrderDetailResponseDto(order);
    }
}