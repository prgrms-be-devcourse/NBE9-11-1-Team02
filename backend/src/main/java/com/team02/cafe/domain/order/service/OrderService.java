package com.team02.cafe.domain.order.service;
import com.team02.cafe.domain.order.dto.MergedOrderDto;
import com.team02.cafe.domain.order.dto.MergedProductDto;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
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

            product.decreaseQuantity(quantity);
            order.addOrderProduct(product, quantity);
        }

        orderRepository.save(order);

        return new OrderResponse(order);
    }

    private LocalDate getDeliveryDate() {
        LocalDateTime now = LocalDateTime.now();
        if (now.toLocalTime().isBefore(LocalTime.of(14, 0))) {
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
    public List<OrderResponseDto> getOrdersByEmail(String email) {
        return orderRepository.findByEmailOrderByCreatedAtDesc(email).stream()
                .map(OrderResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDetailResponseDto getOrderDetails(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        return new OrderDetailResponseDto(order);
    }
    @Transactional(readOnly = true)
    public List<MergedOrderDto> getMergedOrdersForDelivery() {
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

        // 1. 해당 기간 내 취소되지 않은 '모든' 주문 조회
        List<Order> targetOrders = orderRepository.findByCreatedAtBetweenAndOrderStatusNot(start, end, OrderStatus.CANCELLED);

        // 2. 이메일을 기준으로 주문들을 그룹화 (이메일 -> 주문 리스트)
        Map<String, List<Order>> groupedByEmail = targetOrders.stream()
                .collect(Collectors.groupingBy(Order::getEmail));

        // 3. 묶여진 그룹을 MergedOrderDto로 예쁘게 변환
        return groupedByEmail.entrySet().stream().map(entry -> {
            String email = entry.getKey();
            List<Order> orders = entry.getValue();

            // 주소, 전화번호 등은 동일 이메일의 첫 번째 주문 정보를 대표로 사용
            Order firstOrder = orders.get(0);
            String address = firstOrder.getAddress();
            String phoneNumber = firstOrder.getPhoneNumber();

            // 이메일별 총 결제 금액 다 더하기
            long totalMergedPrice = orders.stream().mapToLong(Order::getTotalPrice).sum();

            // 상품 이름 기준으로 수량과 금액 합치기
            Map<String, MergedProductDto> productMap = new HashMap<>();
            for (Order order : orders) {
                for (OrderProduct op : order.getOrderProducts()) {
                    String pName = op.getProduct().getName();
                    long pQuantity = op.getOrderQuantity();
                    long pPrice = op.getOrderPrice();

                    // Map.merge: 이미 해당 상품이 있으면 기존 객체와 새 객체의 수량/금액을 더해서 합치기
                    productMap.merge(pName,
                            new MergedProductDto(pName, pQuantity, pPrice),
                            (existing, newOne) -> new MergedProductDto(
                                    pName,
                                    existing.getTotalQuantity() + newOne.getTotalQuantity(),
                                    existing.getTotalPrice() + newOne.getTotalPrice()
                            ));
                }
            }

            return new MergedOrderDto(email, address, phoneNumber, totalMergedPrice, new ArrayList<>(productMap.values()));
        }).collect(Collectors.toList());

    }
}