package com.team02.cafe.domain.order.service;

import com.team02.cafe.domain.order.dto.OrderDetailResponseDto;
import com.team02.cafe.domain.order.dto.OrderRequest;
import com.team02.cafe.domain.order.dto.OrderResponse;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderProductRepository orderProductRepository;

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        // 주문은 매번 새로 생성 (배송날짜 미리 계산)
        Order order = new Order(
                request.email(),
                request.username(),
                request.address(),
                request.phoneNumber(),
                OrderStatus.READY,
                getDeliveryDate()
        );

        for (OrderProductRequest opReq : request.orderProductRequestList()) {
            Product product = productRepository.findById(opReq.productId())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 상품입니다."));

            long quantity = opReq.orderQuantity();

            // 재고 차감 추가
            product.decreaseQuantity(quantity);
            order.addOrderProduct(product, quantity);
        }
        orderRepository.save(order);

        return new OrderResponse(order);
    }

    private LocalDate getDeliveryDate() {
        LocalDateTime now = LocalDateTime.now();
        if(now.toLocalTime().isBefore(LocalTime.of(14, 0))) {
            return LocalDate.now();
        } else {
            return LocalDate.now().plusDays(1);
        }
    }

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
            product.increaseQuantity(orderProduct.getOrderQuantity());
        }

        order.changeStatus(OrderStatus.CANCELLED);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDetailResponseDto getOrderDetails(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        return new OrderDetailResponseDto(order);
    }
}